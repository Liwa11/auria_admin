# 🚀 Dynamische CRUD Functionaliteit - Setup Guide

## ✅ Wat is er gebouwd?

Een volledig dynamische CRUD (Create, Read, Update, Delete) functionaliteit voor alle tabellen in je Auria Admin Dashboard:

### 🔧 Componenten
- **`CrudTable.tsx`** - Herbruikbare tabel component met formulieren
- **`crud.ts`** - Generieke CRUD functies voor Supabase
- **`tableConfigs`** - Configuratie voor alle tabellen

### 📊 Ondersteunde Tabellen
- ✅ **Regio's** - Regio beheer
- ✅ **Campagnes** - Marketing campagnes
- ✅ **Klanten** - Klantgegevens
- ✅ **Verkopers** - Verkoper beheer
- ✅ **Gesprekken** - Klantgesprekken
- ✅ **Belschema** - Belplanningen
- ✅ **Logs** - Systeem logs
- ✅ **Rapporten** - Rapport beheer
- ✅ **Instellingen** - Systeem instellingen

## 🗄️ Database Setup

### 1. Supabase Tabellen Aanmaken
1. Ga naar je Supabase Dashboard
2. Open de **SQL Editor**
3. Kopieer en plak de inhoud van `database-setup.sql`
4. Klik op **Run** om alle tabellen aan te maken

### 2. Environment Variables
Zorg dat je `.env.local` bestand de juiste Supabase gegevens bevat:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🎯 Functionaliteiten

### 📋 Voor Elke Tabel:
- **📊 Data Tabel** - Overzicht van alle records
- **➕ Toevoegen** - Nieuwe records toevoegen
- **✏️ Wijzigen** - Bestaande records bewerken
- **🗑️ Verwijderen** - Records verwijderen
- **🔍 Dynamische Formulieren** - Automatisch gegenereerd op basis van tabelstructuur

### 🎨 Formulier Types:
- **Text** - Tekst invoer
- **Email** - Email validatie
- **Number** - Numerieke invoer
- **Textarea** - Lange tekst
- **Select** - Dropdown met opties
- **Date** - Datum picker
- **Boolean** - Checkbox

## 🚀 Hoe te Gebruiken

### 1. Start de Applicatie
```bash
cd auria_admin
npm run dev
```

### 2. Navigeer naar een Tabel
- Ga naar `http://localhost:3000`
- Log in met je Supabase credentials
- Klik op een tabel in de sidebar (bijv. "Regio's")

### 3. Test de Functionaliteit
- **Bekijk data** - Alle records worden getoond
- **Voeg toe** - Klik op "+ Toevoegen"
- **Bewerk** - Klik op "✏️ Wijzigen" bij een rij
- **Verwijder** - Klik op "🗑️ Verwijderen" bij een rij

## 🔧 Aanpassen van Tabellen

### Nieuwe Tabel Toevoegen:
1. **Database**: Voeg tabel toe in Supabase
2. **Config**: Voeg configuratie toe in `src/lib/crud.ts`
3. **Route**: Maak nieuwe pagina in `src/app/(dashboard)/[naam]/page.tsx`

### Voorbeeld Configuratie:
```typescript
nieuwe_tabel: {
  tableName: 'nieuwe_tabel',
  displayName: 'Nieuwe Tabel',
  fields: [
    { name: 'naam', label: 'Naam', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'actief', label: 'Actief', type: 'boolean' },
  ],
}
```

## 🎨 Customization

### Styling Aanpassen:
- Wijzig CSS classes in `CrudTable.tsx`
- Gebruik Tailwind classes voor styling
- Pas modal styling aan voor formulieren

### Validatie Toevoegen:
- Voeg validatie toe in `handleSubmit` functie
- Gebruik libraries zoals Zod voor schema validatie

### Relaties Beheren:
- Voor foreign keys (zoals `regio_id`), voeg relatie data toe
- Gebruik `useEffect` om gerelateerde data te laden

## 🔒 Beveiliging

### Row Level Security (RLS):
- Alle tabellen hebben RLS ingeschakeld
- Alleen geauthenticeerde gebruikers kunnen data beheren
- Pas RLS policies aan voor specifieke rechten

### Input Validatie:
- Server-side validatie in Supabase
- Client-side validatie in formulieren
- SQL injection bescherming via Supabase

## 🐛 Troubleshooting

### Veelvoorkomende Problemen:

1. **"Table doesn't exist"**
   - Controleer of je de SQL script hebt uitgevoerd
   - Controleer tabelnamen in configuratie

2. **"Permission denied"**
   - Controleer RLS policies
   - Controleer of gebruiker is ingelogd

3. **"Form doesn't work"**
   - Controleer field types in configuratie
   - Controleer required fields

4. **"Data not loading"**
   - Controleer Supabase verbinding
   - Controleer environment variables

## 📈 Volgende Stappen

### Mogelijke Uitbreidingen:
- **Zoeken & Filteren** - Zoekfunctionaliteit per kolom
- **Paginering** - Voor grote datasets
- **Export** - CSV/Excel export
- **Bulk Operations** - Meerdere records tegelijk
- **Audit Log** - Wijzigingen bijhouden
- **File Upload** - Voor afbeeldingen/documenten

### Performance Optimalisatie:
- **Caching** - SWR voor data caching
- **Lazy Loading** - Alleen zichtbare data laden
- **Virtual Scrolling** - Voor zeer grote tabellen

---

## 🎉 Klaar!

Je hebt nu een volledig werkende, dynamische CRUD applicatie! Alle tabellen zijn configureerbaar en herbruikbaar. Test de functionaliteit en laat me weten als je aanpassingen nodig hebt. 