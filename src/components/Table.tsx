import React from "react";

type TableProps = {
  columns: { key: string; label: string }[];
  data: unknown[];
  onRowClick?: (row: unknown) => void;
};

export default function Table({ columns, data, onRowClick }: TableProps) {
  return (
    <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, idx) => (
            <tr
              key={(row as { id?: string | number })?.id ?? idx}
              className={onRowClick ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {String((row as Record<string, unknown>)?.[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 