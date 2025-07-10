import { supabase } from './supabase';
import { TableSchema } from './table-schemas';

export interface CrudService {
  fetchData: (tableName: string) => Promise<any[]>;
  fetchRelatedData: (tableName: string, valueField: string, labelField: string) => Promise<{ value: any; label: string }[]>;
  addRow: (tableName: string, data: any) => Promise<any>;
  updateRow: (tableName: string, id: number, data: any) => Promise<any>;
  deleteRow: (tableName: string, id: number) => Promise<void>;
}

class CrudServiceImpl implements CrudService {
  async fetchData(tableName: string): Promise<any[]> {
    console.log(`🔍 Fetching data from table: ${tableName}`);
    
    try {
      // Special handling for logs table which uses created_at instead of aangemaakt_op
      const orderColumn = tableName === 'logs' ? 'created_at' : 'aangemaakt_op';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(orderColumn, { ascending: false });

      if (error) {
        console.error(`❌ Error fetching data from ${tableName}:`, error);
        throw error;
      }

      console.log(`✅ Successfully fetched ${data?.length || 0} rows from ${tableName}`);
      return data || [];
    } catch (error) {
      console.error(`💥 Exception fetching data from ${tableName}:`, error);
      throw error;
    }
  }

  async fetchRelatedData(tableName: string, valueField: string, labelField: string): Promise<{ value: any; label: string }[]> {
    console.log(`🔍 Fetching related data from ${tableName} (${valueField} -> ${labelField})`);
    
    try {
      // Check if table exists by trying to fetch a single row
      const { data: testData, error: testError } = await supabase
        .from(tableName)
        .select(`${valueField}, ${labelField}`)
        .limit(1);

      if (testError) {
        console.warn(`⚠️ Table ${tableName} might not exist or have access issues:`, testError);
        return [];
      }

      const { data, error } = await supabase
        .from(tableName)
        .select(`${valueField}, ${labelField}`)
        .order(labelField, { ascending: true });

      if (error) {
        console.error(`❌ Error fetching related data from ${tableName}:`, error);
        return [];
      }

      const result = (data || []).map(item => ({
        value: item[valueField as keyof typeof item],
        label: String(item[labelField as keyof typeof item] || 'Onbekend')
      }));

      console.log(`✅ Successfully fetched ${result.length} related items from ${tableName}`);
      return result;
    } catch (error) {
      console.error(`💥 Exception fetching related data from ${tableName}:`, error);
      return [];
    }
  }

  async addRow(tableName: string, data: any): Promise<any> {
    console.log(`➕ Adding row to ${tableName}:`, data);
    
    try {
      const { data: newRow, error } = await supabase
        .from(tableName)
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error(`❌ Error adding row to ${tableName}:`, error);
        throw error;
      }

      console.log(`✅ Successfully added row to ${tableName}:`, newRow);
      return newRow;
    } catch (error) {
      console.error(`💥 Exception adding row to ${tableName}:`, error);
      throw error;
    }
  }

  async updateRow(tableName: string, id: number, data: any): Promise<any> {
    console.log(`✏️ Updating row ${id} in ${tableName}:`, data);
    
    try {
      const { data: updatedRow, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error updating row in ${tableName}:`, error);
        throw error;
      }

      console.log(`✅ Successfully updated row in ${tableName}:`, updatedRow);
      return updatedRow;
    } catch (error) {
      console.error(`💥 Exception updating row in ${tableName}:`, error);
      throw error;
    }
  }

  async deleteRow(tableName: string, id: number): Promise<void> {
    console.log(`🗑️ Deleting row ${id} from ${tableName}`);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`❌ Error deleting row from ${tableName}:`, error);
        throw error;
      }

      console.log(`✅ Successfully deleted row ${id} from ${tableName}`);
    } catch (error) {
      console.error(`💥 Exception deleting row from ${tableName}:`, error);
      throw error;
    }
  }
}

export const crudService = new CrudServiceImpl(); 