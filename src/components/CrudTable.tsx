'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TableSchema, tableSchemas } from '@/lib/table-schemas';
import { crudService } from '@/lib/crud-service';

interface CrudTableProps {
  tableKey: string;
}

export default function CrudTable({ tableKey }: CrudTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [relatedData, setRelatedData] = useState<Record<string, { value: any; label: string }[]>>({});

  const schema = tableSchemas[tableKey];
  if (!schema) {
    return <div className="text-red-500">Tabel schema niet gevonden voor: {tableKey}</div>;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema.validationSchema as any),
  });

  // Load main data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Loading data for table: ${schema.tableName}`);
      
      const result = await crudService.fetchData(schema.tableName);
      setData(result);
      console.log(`✅ Loaded ${result.length} rows for ${schema.tableName}`);
    } catch (err: any) {
      const errorMessage = err?.message || 'Onbekende fout';
      console.error(`❌ Error loading data for ${schema.tableName}:`, err);
      setError(`Fout bij laden van data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Load related data for dropdowns
  const loadRelatedData = async () => {
    const relations: Record<string, { value: any; label: string }[]> = {};
    
    for (const field of schema.fields) {
      if (field.relation) {
        try {
          console.log(`🔄 Loading related data for ${field.name} -> ${field.relation.table}`);
          const relatedData = await crudService.fetchRelatedData(
            field.relation.table,
            field.relation.valueField,
            field.relation.labelField
          );
          relations[field.name] = relatedData;
          console.log(`✅ Loaded ${relatedData.length} related items for ${field.name}`);
        } catch (err: any) {
          console.warn(`⚠️ Could not load related data for ${field.name}:`, err);
          relations[field.name] = [];
        }
      }
    }
    
    setRelatedData(relations);
  };

  useEffect(() => {
    console.log(`🚀 Initializing CrudTable for ${tableKey}`);
    loadData();
    loadRelatedData();
  }, [tableKey]);

  const onSubmit = async (formData: any) => {
    try {
      setError(null);
      console.log(`💾 Submitting form data for ${schema.tableName}:`, formData);
      
      if (editingRow) {
        await crudService.updateRow(schema.tableName, editingRow.id, formData);
        console.log(`✅ Updated row in ${schema.tableName}`);
      } else {
        await crudService.addRow(schema.tableName, formData);
        console.log(`✅ Added new row to ${schema.tableName}`);
      }
      
      setShowModal(false);
      setEditingRow(null);
      reset();
      await loadData(); // Reload data after successful operation
    } catch (err: any) {
      const errorMessage = err?.message || 'Onbekende fout';
      console.error(`❌ Error saving data for ${schema.tableName}:`, err);
      setError(`Fout bij opslaan van data: ${errorMessage}`);
    }
  };

  const handleEdit = (row: any) => {
    console.log(`✏️ Editing row:`, row);
    setEditingRow(row);
    reset(row);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Weet je zeker dat je dit item wilt verwijderen?')) {
      try {
        setError(null);
        console.log(`🗑️ Deleting row ${id} from ${schema.tableName}`);
        await crudService.deleteRow(schema.tableName, id);
        console.log(`✅ Deleted row ${id} from ${schema.tableName}`);
        await loadData(); // Reload data after successful deletion
      } catch (err: any) {
        const errorMessage = err?.message || 'Onbekende fout';
        console.error(`❌ Error deleting row from ${schema.tableName}:`, err);
        setError(`Fout bij verwijderen van data: ${errorMessage}`);
      }
    }
  };

  const handleAdd = () => {
    console.log(`➕ Adding new row to ${schema.tableName}`);
    setEditingRow(null);
    reset({});
    setShowModal(true);
  };

  const renderField = (field: any) => {
    const fieldName = field.name;
    
    // Skip system fields in forms
    if (['id', 'aangemaakt_op', 'bijgewerkt_op', 'created_at'].includes(fieldName)) {
      return null;
    }

    const baseProps = {
      ...register(fieldName),
      className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={3}
            placeholder={`Voer ${field.label.toLowerCase()} in`}
          />
        );

      case 'select':
        if (field.relation) {
          const options = relatedData[fieldName] || [];
          return (
            <select {...baseProps}>
              <option value="">Selecteer {field.label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        } else if (field.options) {
          return (
            <select {...baseProps}>
              <option value="">Selecteer {field.label}</option>
              {field.options.map((option: any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        }
        break;

      case 'boolean':
        return (
          <input
            {...register(fieldName)}
            type="checkbox"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        );

      case 'date':
        return (
          <input
            {...baseProps}
            type="date"
          />
        );

      case 'number':
        return (
          <input
            {...baseProps}
            type="number"
            step="any"
            placeholder={`Voer ${field.label.toLowerCase()} in`}
          />
        );

      case 'email':
        return (
          <input
            {...baseProps}
            type="email"
            placeholder={`Voer ${field.label.toLowerCase()} in`}
          />
        );

      default:
        return (
          <input
            {...baseProps}
            type="text"
            placeholder={`Voer ${field.label.toLowerCase()} in`}
          />
        );
    }
  };

  const formatCellValue = (value: any, field: any) => {
    if (value === null || value === undefined) return '-';
    
    if (field.type === 'boolean') {
      return value ? 'Ja' : 'Nee';
    }
    
    if (field.type === 'date' || field.type === 'datetime') {
      try {
        return new Date(value).toLocaleDateString('nl-NL');
      } catch {
        return value;
      }
    }
    
    // Special handling for script field in call_scripts table
    if (field.name === 'script' && schema.tableName === 'call_scripts') {
      return (
        <div 
          className="max-h-[150px] overflow-y-auto whitespace-pre-wrap text-sm bg-gray-50 p-2 rounded border"
          style={{ maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}
        >
          {String(value)}
        </div>
      );
    }
    
    // Special handling for data field in logs table
    if (field.name === 'data' && typeof value === 'object') {
      return (
        <details className="cursor-pointer">
          <summary className="text-blue-600 hover:text-blue-800">
            JSON Data ({Object.keys(value).length} keys)
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(value, null, 2)}
          </pre>
        </details>
      );
    }
    
    if (field.relation && relatedData[field.name]) {
      const option = relatedData[field.name].find(opt => opt.value === value);
      return option ? option.label : value;
    }
    
    if (field.options) {
      const option = field.options.find((opt: any) => opt.value === value);
      return option ? option.label : value;
    }
    
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Laden van {schema.displayName}...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{schema.displayName}</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Toevoegen
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm"
          >
            Sluiten
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {schema.fields.map((field) => (
                  <th
                    key={field.name}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={schema.fields.length + 1} className="px-6 py-4 text-center text-gray-500">
                    Geen data beschikbaar
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {schema.fields.map((field) => (
                      <td key={field.name} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCellValue(row[field.name], field)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        ✏️ Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑 Verwijderen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingRow ? 'Bewerken' : 'Toevoegen'} {schema.displayName}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingRow(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {schema.fields.map((field) => {
                const fieldElement = renderField(field);
                if (!fieldElement) return null;

                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    {fieldElement}
                    {errors[field.name] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors[field.name]?.message as string}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRow(null);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingRow ? 'Bijwerken' : 'Toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 