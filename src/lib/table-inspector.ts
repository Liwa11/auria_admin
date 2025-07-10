import { supabase } from './supabase';

export interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default?: string;
}

export async function inspectTable(tableName: string): Promise<ColumnInfo[]> {
  const { data, error } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_name', tableName)
    .eq('table_schema', 'public')
    .order('ordinal_position');

  if (error) {
    console.error(`Error inspecting table ${tableName}:`, error);
    throw error;
  }

  return data || [];
}

export async function listTables(): Promise<string[]> {
  const { data, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_type', 'BASE TABLE');

  if (error) {
    console.error('Error listing tables:', error);
    throw error;
  }

  return data?.map(table => table.table_name) || [];
}

// Helper function to suggest field type based on PostgreSQL data type
export function suggestFieldType(dataType: string): 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date' | 'boolean' {
  switch (dataType.toLowerCase()) {
    case 'boolean':
      return 'boolean';
    case 'date':
    case 'timestamp':
    case 'timestamptz':
      return 'date';
    case 'integer':
    case 'bigint':
    case 'numeric':
    case 'decimal':
    case 'real':
    case 'double precision':
      return 'number';
    case 'text':
    case 'varchar':
    case 'char':
      return 'text';
    default:
      return 'text';
  }
}

// Generate a basic config from existing table structure
export async function generateConfigFromTable(tableName: string, displayName: string) {
  const columns = await inspectTable(tableName);
  
  const fields = columns
    .filter(col => col.column_name !== 'id' && !col.column_name.includes('created_at') && !col.column_name.includes('updated_at'))
    .map(col => ({
      name: col.column_name,
      label: col.column_name.charAt(0).toUpperCase() + col.column_name.slice(1).replace(/_/g, ' '),
      type: suggestFieldType(col.data_type),
      required: col.is_nullable === 'NO',
    }));

  return {
    tableName,
    displayName,
    fields,
  };
} 