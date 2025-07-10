"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { crudService } from '@/lib/crud-service';

// Validation schema for logs
const logSchema = z.object({
  type: z.string().min(1, 'Type is verplicht'),
  status: z.string().min(1, 'Status is verplicht'),
  message: z.string().min(1, 'Message is verplicht'),
  data: z.string().optional(),
  user_id: z.string().optional(),
  ip: z.string().optional(),
  device: z.string().optional(),
  region: z.string().optional(),
  twilio_sid: z.string().optional(),
});

type LogData = {
  id: string;
  type: string;
  status: string;
  message: string;
  data?: any;
  created_at: string;
  user_id?: string;
  ip?: string;
  device?: string;
  region?: string;
  twilio_sid?: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState<LogData | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(logSchema),
  });

  // Load logs data
  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await crudService.fetchData('logs');
      setLogs(result);
      
      // Extract unique types and statuses for filters
      const types = [...new Set(result.map(log => log.type).filter(Boolean))];
      const statuses = [...new Set(result.map(log => log.status).filter(Boolean))];
      setUniqueTypes(types);
      setUniqueStatuses(statuses);
      
    } catch (err: any) {
      const errorMessage = err?.message || 'Onbekende fout';
      setError(`Fout bij laden van logs: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Filter logs based on type and status
  const filteredLogs = logs.filter(log => {
    const matchesType = !filterType || log.type === filterType;
    const matchesStatus = !filterStatus || log.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const onSubmit = async (formData: any) => {
    try {
      setError(null);
      
      // Parse data field if it's JSON
      if (formData.data && formData.data.trim()) {
        try {
          formData.data = JSON.parse(formData.data);
        } catch {
          // If not valid JSON, keep as string
        }
      }
      
      if (editingLog) {
        await crudService.updateRow('logs', editingLog.id, formData);
      } else {
        await crudService.addRow('logs', formData);
      }
      
      setShowModal(false);
      setEditingLog(null);
      reset();
      await loadLogs();
    } catch (err: any) {
      const errorMessage = err?.message || 'Onbekende fout';
      setError(`Fout bij opslaan van log: ${errorMessage}`);
    }
  };

  const handleEdit = (log: LogData) => {
    setEditingLog(log);
    // Convert data object to string for form
    const formData = {
      ...log,
      data: log.data ? JSON.stringify(log.data, null, 2) : ''
    };
    reset(formData);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je deze log wilt verwijderen?')) {
      try {
        setError(null);
        await crudService.deleteRow('logs', id);
        await loadLogs();
      } catch (err: any) {
        const errorMessage = err?.message || 'Onbekende fout';
        setError(`Fout bij verwijderen van log: ${errorMessage}`);
      }
    }
  };

  const handleAdd = () => {
    setEditingLog(null);
    reset({});
    setShowModal(true);
  };

  const formatCellValue = (value: any, fieldName: string) => {
    if (value === null || value === undefined) return '-';
    
    if (fieldName === 'created_at') {
      try {
        return new Date(value).toLocaleString('nl-NL');
      } catch {
        return value;
      }
    }
    
    if (fieldName === 'data' && typeof value === 'object') {
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
    
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Laden van logs...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Logs</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Nieuwe Log
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

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alle types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Alle statussen</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Twilio SID</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-4 text-center text-gray-500">
                    Geen logs gevonden
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{log.message}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCellValue(log.data, 'data')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCellValue(log.created_at, 'created_at')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user_id || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.ip || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.device || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.region || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.twilio_sid || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(log)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        ✏️ Bewerken
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingLog ? 'Bewerken' : 'Toevoegen'} Log
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingLog(null);
                  reset();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('type')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer type in"
                  />
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('status')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer status in"
                  />
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Voer message in"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data (JSON)
                </label>
                <textarea
                  {...register('data')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
                {errors.data && (
                  <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    {...register('user_id')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer user ID in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP
                  </label>
                  <input
                    {...register('ip')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer IP in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Device
                  </label>
                  <input
                    {...register('device')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer device in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region
                  </label>
                  <input
                    {...register('region')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer region in"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twilio SID
                  </label>
                  <input
                    {...register('twilio_sid')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Voer Twilio SID in"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLog(null);
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
                  {editingLog ? 'Bijwerken' : 'Toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 