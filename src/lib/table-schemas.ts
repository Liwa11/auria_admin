import { z } from 'zod';

export interface TableField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date' | 'boolean' | 'datetime';
  required?: boolean;
  options?: { value: string | number; label: string }[];
  relation?: {
    table: string;
    valueField: string;
    labelField: string;
  };
}

export interface TableSchema {
  tableName: string;
  displayName: string;
  fields: TableField[];
  validationSchema: z.ZodSchema<any>;
}

// Zod schemas for each table - only including existing tables
export const tableSchemas: Record<string, TableSchema> = {
  regio: {
    tableName: 'regio',
    displayName: 'Regio',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'beschrijving', label: 'Beschrijving', type: 'textarea' },
      { name: 'actief', label: 'Actief', type: 'boolean' },
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      naam: z.string().min(1, 'Naam is verplicht'),
      code: z.string().min(1, 'Code is verplicht'),
      beschrijving: z.string().optional(),
      actief: z.boolean().optional(),
    }),
  },

  campagnes: {
    tableName: 'campagnes',
    displayName: 'Campagne',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'beschrijving', label: 'Beschrijving', type: 'textarea' },
      { name: 'start_datum', label: 'Start Datum', type: 'date' },
      { name: 'eind_datum', label: 'Eind Datum', type: 'date' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'actief', label: 'Actief' },
        { value: 'inactief', label: 'Inactief' },
        { value: 'voltooid', label: 'Voltooid' },
      ]},
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      naam: z.string().min(1, 'Naam is verplicht'),
      beschrijving: z.string().optional(),
      start_datum: z.string().optional(),
      eind_datum: z.string().optional(),
      status: z.enum(['actief', 'inactief', 'voltooid']).optional(),
    }),
  },

  klanten: {
    tableName: 'klanten',
    displayName: 'Klant',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'telefoon', label: 'Telefoon', type: 'text' },
      { name: 'adres', label: 'Adres', type: 'textarea' },
      { name: 'regio_id', label: 'Regio', type: 'select', relation: {
        table: 'regio',
        valueField: 'id',
        labelField: 'naam'
      }},
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'actief', label: 'Actief' },
        { value: 'inactief', label: 'Inactief' },
        { value: 'prospect', label: 'Prospect' },
      ]},
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      naam: z.string().min(1, 'Naam is verplicht'),
      email: z.string().email('Ongeldig email adres'),
      telefoon: z.string().optional(),
      adres: z.string().optional(),
      regio_id: z.number().optional(),
      status: z.enum(['actief', 'inactief', 'prospect']).optional(),
    }),
  },

  verkopers: {
    tableName: 'verkopers',
    displayName: 'Verkoper',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'telefoon', label: 'Telefoon', type: 'text' },
      { name: 'regio_id', label: 'Regio', type: 'select', relation: {
        table: 'regio',
        valueField: 'id',
        labelField: 'naam'
      }},
      { name: 'commissie_percentage', label: 'Commissie %', type: 'number' },
      { name: 'actief', label: 'Actief', type: 'boolean' },
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      naam: z.string().min(1, 'Naam is verplicht'),
      email: z.string().email('Ongeldig email adres'),
      telefoon: z.string().optional(),
      regio_id: z.number().optional(),
      commissie_percentage: z.number().optional(),
      actief: z.boolean().optional(),
    }),
  },

  gesprekken: {
    tableName: 'gesprekken',
    displayName: 'Gesprek',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'klant_id', label: 'Klant', type: 'select', required: true, relation: {
        table: 'klanten',
        valueField: 'id',
        labelField: 'naam'
      }},
      { name: 'verkoper_id', label: 'Verkoper', type: 'select', required: true, relation: {
        table: 'verkopers',
        valueField: 'id',
        labelField: 'naam'
      }},
      { name: 'campagne_id', label: 'Campagne', type: 'select', relation: {
        table: 'campagnes',
        valueField: 'id',
        labelField: 'naam'
      }},
      { name: 'regio_id', label: 'Regio', type: 'select', relation: {
        table: 'regio',
        valueField: 'id',
        labelField: 'naam'
      }},
      { name: 'datum', label: 'Datum', type: 'date', required: true },
      { name: 'notities', label: 'Notities', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { value: 'gepland', label: 'Gepland' },
        { value: 'voltooid', label: 'Voltooid' },
        { value: 'geannuleerd', label: 'Geannuleerd' },
      ]},
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      klant_id: z.number().min(1, 'Klant is verplicht'),
      verkoper_id: z.number().min(1, 'Verkoper is verplicht'),
      campagne_id: z.number().optional(),
      regio_id: z.number().optional(),
      datum: z.string().min(1, 'Datum is verplicht'),
      notities: z.string().optional(),
      status: z.enum(['gepland', 'voltooid', 'geannuleerd']).optional(),
    }),
  },

  logs: {
    tableName: 'logs',
    displayName: 'Log',
    fields: [
      { name: 'id', label: 'ID', type: 'text', required: true },
      { name: 'type', label: 'Type', type: 'text', required: true },
      { name: 'status', label: 'Status', type: 'text', required: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true },
      { name: 'data', label: 'Data', type: 'textarea' },
      { name: 'created_at', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'user_id', label: 'User ID', type: 'text' },
      { name: 'ip', label: 'IP', type: 'text' },
      { name: 'device', label: 'Device', type: 'text' },
      { name: 'region', label: 'Region', type: 'text' },
      { name: 'twilio_sid', label: 'Twilio SID', type: 'text' },
    ],
    validationSchema: z.object({
      type: z.string().min(1, 'Type is verplicht'),
      status: z.string().min(1, 'Status is verplicht'),
      message: z.string().min(1, 'Message is verplicht'),
      data: z.string().optional(),
      user_id: z.string().optional(),
      ip: z.string().optional(),
      device: z.string().optional(),
      region: z.string().optional(),
      twilio_sid: z.string().optional(),
    }),
  },

  admin_users: {
    tableName: 'admin_users',
    displayName: 'Admin Gebruiker',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'rol', label: 'Rol', type: 'select', required: true, options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'manager', label: 'Manager' },
        { value: 'user', label: 'Gebruiker' },
      ]},
      { name: 'actief', label: 'Actief', type: 'boolean' },
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      email: z.string().email('Ongeldig email adres'),
      naam: z.string().min(1, 'Naam is verplicht'),
      rol: z.enum(['admin', 'manager', 'user']),
      actief: z.boolean().optional(),
    }),
  },

  call_scripts: {
    tableName: 'call_scripts',
    displayName: 'Call Script',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'script', label: 'Script', type: 'textarea', required: true },
      { name: 'actief', label: 'Actief', type: 'boolean' },
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      naam: z.string().min(1, 'Naam is verplicht'),
      script: z.string().min(1, 'Script is verplicht'),
      actief: z.boolean().optional(),
    }),
  },

  belschema: {
    tableName: 'belschema',
    displayName: 'Belschema',
    fields: [
      { name: 'id', label: 'ID', type: 'number', required: true },
      { name: 'naam', label: 'Naam', type: 'text', required: true },
      { name: 'beschrijving', label: 'Beschrijving', type: 'textarea' },
      { name: 'actief', label: 'Actief', type: 'boolean' },
      { name: 'aangemaakt_op', label: 'Aangemaakt op', type: 'datetime' },
      { name: 'bijgewerkt_op', label: 'Bijgewerkt op', type: 'datetime' },
    ],
    validationSchema: z.object({
      naam: z.string().min(1, 'Naam is verplicht'),
      beschrijving: z.string().optional(),
      actief: z.boolean().optional(),
    }),
  },
}; 