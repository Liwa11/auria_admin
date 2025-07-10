"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { crudService } from '@/lib/crud-service';
import { tableSchemas } from '@/lib/table-schemas';

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [tableInfo, setTableInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      
      // Test basic connection
      const { data, error } = await supabase.from('regio').select('count').limit(1);
      
      if (error) {
        setConnectionStatus(`❌ Connection failed: ${error.message}`);
        return;
      }
      
      setConnectionStatus('✅ Connection successful');
      
      // Test all tables
      const tableTests = await Promise.allSettled(
        Object.entries(tableSchemas).map(async ([key, schema]) => {
          try {
            const result = await crudService.fetchData(schema.tableName);
            return {
              table: schema.tableName,
              displayName: schema.displayName,
              status: '✅ Working',
              rowCount: result.length,
              error: null
            };
          } catch (err: any) {
            return {
              table: schema.tableName,
              displayName: schema.displayName,
              status: '❌ Error',
              rowCount: 0,
              error: err.message
            };
          }
        })
      );
      
      const results = tableTests.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          const key = Object.keys(tableSchemas)[index];
          const schema = tableSchemas[key];
          return {
            table: schema.tableName,
            displayName: schema.displayName,
            status: '❌ Failed',
            rowCount: 0,
            error: 'Promise rejected'
          };
        }
      });
      
      setTableInfo(results);
      
    } catch (error: any) {
      setConnectionStatus(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🔧 Database Debug</h2>
        
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
            <p className={connectionStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
              {connectionStatus}
            </p>
          </div>

          {/* Table Status */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Table Status</h3>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2">Testing tables...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Display Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rows</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableInfo.map((info) => (
                      <tr key={info.table}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {info.table}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {info.displayName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={info.status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                            {info.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {info.rowCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-red-600">
                          {info.error || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Test Button */}
          <div>
            <button
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Connection Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 