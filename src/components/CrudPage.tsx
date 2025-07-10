"use client";
import { useState, useMemo, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import Table from "./Table";
import FormModal from "./FormModal";
import Loading from "./Loading";
import Error from "./Error";
import { crudConfigs, CrudConfig, CrudField } from "./crudConfig";

function getDefaultValues(fields: CrudField[]) {
  const values: Record<string, unknown> = {};
  fields.forEach(f => {
    if (f.default !== undefined) values[f.name] = f.default;
    else values[f.name] = f.type === 'boolean' ? false : '';
  });
  return values;
}

function getFormFields(fields: CrudField[], mode: 'create' | 'edit') {
  return fields.filter(f => f.editable !== false && (mode === 'create' ? f.name !== 'id' && f.name !== 'created_at' : f.name !== 'created_at'));
}

export default function CrudPage({ configKey }: { configKey: keyof typeof crudConfigs }) {
  const { supabase } = useAuth();
  const config: CrudConfig = crudConfigs[configKey];
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: config.fields[0].name, dir: 'asc' });
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit' | 'view'; row?: Record<string, unknown> }>({ open: false, mode: 'create' });
  const [saving, setSaving] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from(config.table).select("*");
    // Filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") query = query.eq(key, value);
    });
    // Search (simple: OR on all string fields)
    if (search) {
      const stringFields = config.fields.filter(f => f.type === 'string').map(f => f.name);
      if (stringFields.length) {
        query = query.or(stringFields.map(f => `${f}.ilike.%${search}%`).join(","));
      }
    }
    // Sort
    if (sort.key) query = query.order(sort.key, { ascending: sort.dir === 'asc' });
    const { data, error } = await query;
    if (error) setError(error.message);
    else setData(data || []);
    setLoading(false);
  }, [supabase, config.table, config.fields, filters, search, sort]);

  // Initial + refetch
  useMemo(() => { fetchData(); }, [fetchData]);

  // Table columns
  const columns = useMemo(() => config.fields.map(f => ({ key: f.name, label: f.label })), [config]);

  // Handlers
  const handleCreate = async (values: Record<string, unknown>) => {
    setSaving(true);
    const { error } = await supabase.from(config.table).insert([values]);
    setSaving(false);
    if (error) setError(error.message);
    else {
      setModal({ open: false, mode: 'create' });
      fetchData();
    }
  };
  const handleEdit = async (values: Record<string, unknown>) => {
    setSaving(true);
    const { error } = await supabase.from(config.table).update(values).eq('id', values.id as string);
    setSaving(false);
    if (error) setError(error.message);
    else {
      setModal({ open: false, mode: 'edit' });
      fetchData();
    }
  };
  const handleDelete = async (row: Record<string, unknown>) => {
    if (!confirm('Weet je zeker dat je wilt verwijderen?')) return;
    setSaving(true);
    const { error } = await supabase.from(config.table).delete().eq('id', row.id as string);
    setSaving(false);
    if (error) setError(error.message);
    else fetchData();
  };

  // Filter UI
  const filterFields = config.fields.filter(f => f.filterable);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Zoeken..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {filterFields.map(f => f.type === 'enum' ? (
            <select key={f.name} value={filters[f.name] as string ?? ''} onChange={e => setFilters(fl => ({ ...fl, [f.name]: e.target.value }))} className="px-2 py-1 border rounded">
              <option value="">Alle {f.label}</option>
              {f.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : f.type === 'boolean' ? (
            <select key={f.name} value={filters[f.name] as string ?? ''} onChange={e => setFilters(fl => ({ ...fl, [f.name]: e.target.value === '' ? '' : e.target.value === 'true' }))} className="px-2 py-1 border rounded">
              <option value="">Alle {f.label}</option>
              <option value="true">Ja</option>
              <option value="false">Nee</option>
            </select>
          ) : (
            <input key={f.name} type="text" placeholder={f.label} value={filters[f.name] as string ?? ''} onChange={e => setFilters(fl => ({ ...fl, [f.name]: e.target.value }))} className="px-2 py-1 border rounded" />
          ))}
        </div>
        <button onClick={() => setModal({ open: true, mode: 'create' })} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold">Nieuw toevoegen</button>
      </div>
      {error && <Error message={error} />}
      {loading ? <Loading /> : (
        <Table
          columns={columns}
          data={data}
          onRowClick={row => setModal({ open: true, mode: 'view', row: row as Record<string, unknown> })}
        />
      )}
      <FormModal
        open={modal.open}
        title={modal.mode === 'create' ? 'Nieuw toevoegen' : modal.mode === 'edit' ? 'Bewerken' : 'Bekijken'}
        fields={getFormFields(config.fields, modal.mode === 'create' ? 'create' : 'edit').map(f => ({
          name: f.name,
          label: f.label,
          type: f.type === 'boolean' ? 'checkbox' : f.type === 'enum' ? 'select' : f.type === 'timestamp' ? 'datetime-local' : 'text',
          options: f.options,
          value: modal.row?.[f.name] ?? ''
        }))}
        onClose={() => setModal({ open: false, mode: 'create' })}
        onSubmit={modal.mode === 'create' ? handleCreate : handleEdit}
        loading={saving}
        error={error}
        initialValues={modal.row || getDefaultValues(config.fields)}
      />
      {modal.open && modal.mode === 'view' && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => setModal(m => ({ ...m, mode: 'edit' }))} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded">Bewerken</button>
          <button onClick={() => handleDelete(modal.row as Record<string, unknown>)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Verwijderen</button>
        </div>
      )}
    </div>
  );
} 