import React from "react";

type FormModalProps = {
  open: boolean;
  title: string;
  fields: { name: string; label: string; type?: string; value?: unknown; options?: string[] }[];
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => void;
  loading?: boolean;
  error?: string | null;
  initialValues?: Record<string, unknown>;
};

export default function FormModal({ open, title, fields, onClose, onSubmit, loading, error, initialValues = {} }: FormModalProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues);

  React.useEffect(() => {
    setValues(initialValues);
  }, [initialValues, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded shadow-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <form onSubmit={e => { e.preventDefault(); onSubmit(values); }} className="space-y-4">
          {fields.map(field => (
            <label key={field.name} className="block">
              <span className="block text-gray-700 dark:text-gray-200 mb-1">{field.label}</span>
              {field.type === 'select' && field.options ? (
                <select
                  name={field.name}
                  value={values[field.name] as string ?? ""}
                  onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={!!values[field.name]}
                  onChange={e => setValues(v => ({ ...v, [field.name]: e.target.checked }))}
                  className="mr-2"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={values[field.name] as string ?? ""}
                  onChange={e => setValues(v => ({ ...v, [field.name]: e.target.value }))}
                  className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
            </label>
          ))}
          {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded">Annuleren</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50">
              {loading ? "Opslaan..." : "Opslaan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 