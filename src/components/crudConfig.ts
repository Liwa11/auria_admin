export type CrudField = {
  name: string;
  label: string;
  type: 'string' | 'boolean' | 'enum' | 'timestamp' | 'uuid';
  required?: boolean;
  options?: string[];
  unique?: boolean;
  default?: unknown;
  editable?: boolean;
  filterable?: boolean;
};

export type CrudConfig = {
  table: string;
  fields: CrudField[];
};

export const crudConfigs: Record<string, CrudConfig> = {
  admin_users: {
    table: 'admin_users',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'email', label: 'E-mail', type: 'string', required: true, unique: true, filterable: true },
      { name: 'name', label: 'Naam', type: 'string', required: true, filterable: true },
      { name: 'role', label: 'Rol', type: 'enum', required: true, options: ['admin', 'beheerder', 'manager'], filterable: true },
      { name: 'is_active', label: 'Actief', type: 'boolean', default: true, filterable: true },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  regio: {
    table: 'regio',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'naam', label: 'Naam', type: 'string', required: true, filterable: true },
      { name: 'postcode', label: 'Postcode', type: 'string', required: false, filterable: true },
      { name: 'actief', label: 'Actief', type: 'boolean', default: true, filterable: true },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  klanten: {
    table: 'klanten',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'naam', label: 'Naam', type: 'string', required: true, filterable: true },
      { name: 'email', label: 'E-mail', type: 'string', required: false, filterable: true },
      { name: 'telefoon', label: 'Telefoon', type: 'string', required: false, filterable: true },
      { name: 'actief', label: 'Actief', type: 'boolean', default: true, filterable: true },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  verkopers: {
    table: 'verkopers',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'naam', label: 'Naam', type: 'string', required: true, filterable: true },
      { name: 'email', label: 'E-mail', type: 'string', required: false, filterable: true },
      { name: 'actief', label: 'Actief', type: 'boolean', default: true, filterable: true },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  campagnes: {
    table: 'campagnes',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'naam', label: 'Naam', type: 'string', required: true, filterable: true },
      { name: 'startdatum', label: 'Startdatum', type: 'timestamp', required: true, filterable: true },
      { name: 'einddatum', label: 'Einddatum', type: 'timestamp', required: false, filterable: true },
      { name: 'actief', label: 'Actief', type: 'boolean', default: true, filterable: true },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  gesprekken: {
    table: 'gesprekken',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'klant_id', label: 'Klant ID', type: 'uuid', required: true, filterable: true },
      { name: 'verkoper_id', label: 'Verkoper ID', type: 'uuid', required: true, filterable: true },
      { name: 'datum', label: 'Datum', type: 'timestamp', required: true, filterable: true },
      { name: 'notities', label: 'Notities', type: 'string', required: false },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  belschema: {
    table: 'belschema',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'klant_id', label: 'Klant ID', type: 'uuid', required: true, filterable: true },
      { name: 'datum', label: 'Datum', type: 'timestamp', required: true, filterable: true },
      { name: 'opmerking', label: 'Opmerking', type: 'string', required: false },
      { name: 'afgehandeld', label: 'Afgehandeld', type: 'boolean', default: false, filterable: true },
      { name: 'created_at', label: 'Aangemaakt op', type: 'timestamp', editable: false },
    ],
  },
  logs: {
    table: 'logs',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'actie', label: 'Actie', type: 'string', required: true, filterable: true },
      { name: 'gebruiker_id', label: 'Gebruiker ID', type: 'uuid', required: false, filterable: true },
      { name: 'timestamp', label: 'Tijdstip', type: 'timestamp', required: true, filterable: true },
    ],
  },
  rapporten: {
    table: 'rapporten',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'naam', label: 'Naam', type: 'string', required: true, filterable: true },
      { name: 'gegenereerd_op', label: 'Gegenereerd op', type: 'timestamp', required: true, filterable: true },
      { name: 'bestand_url', label: 'Bestand URL', type: 'string', required: false },
    ],
  },
  instellingen: {
    table: 'instellingen',
    fields: [
      { name: 'id', label: 'ID', type: 'uuid', editable: false },
      { name: 'key', label: 'Key', type: 'string', required: true, filterable: true },
      { name: 'value', label: 'Value', type: 'string', required: true },
      { name: 'beschrijving', label: 'Beschrijving', type: 'string', required: false },
    ],
  },
}; 