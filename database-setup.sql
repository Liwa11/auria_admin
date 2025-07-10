-- Database setup script for Auria Admin Dashboard
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS regio ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS campagnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS klanten ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS verkopers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gesprekken ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS belschema ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS rapporten ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS instellingen ENABLE ROW LEVEL SECURITY;

-- Create regio table
CREATE TABLE IF NOT EXISTS regio (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    beschrijving TEXT,
    actief BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campagnes table
CREATE TABLE IF NOT EXISTS campagnes (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    start_datum DATE,
    eind_datum DATE,
    budget DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'actief',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create klanten table
CREATE TABLE IF NOT EXISTS klanten (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefoon VARCHAR(50),
    adres TEXT,
    regio_id INTEGER REFERENCES regio(id),
    status VARCHAR(50) DEFAULT 'actief',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verkopers table
CREATE TABLE IF NOT EXISTS verkopers (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefoon VARCHAR(50),
    regio_id INTEGER REFERENCES regio(id),
    commissie_percentage DECIMAL(5,2) DEFAULT 0,
    actief BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gesprekken table
CREATE TABLE IF NOT EXISTS gesprekken (
    id SERIAL PRIMARY KEY,
    klant_id INTEGER REFERENCES klanten(id),
    verkoper_id INTEGER REFERENCES verkopers(id),
    datum DATE NOT NULL,
    notities TEXT,
    status VARCHAR(50) DEFAULT 'gepland',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create belschema table
CREATE TABLE IF NOT EXISTS belschema (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    start_tijd TIME,
    eind_tijd TIME,
    actief BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    actie VARCHAR(255) NOT NULL,
    beschrijving TEXT,
    gebruiker_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rapporten table
CREATE TABLE IF NOT EXISTS rapporten (
    id SERIAL PRIMARY KEY,
    naam VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    parameters TEXT,
    laatst_genereren TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instellingen table
CREATE TABLE IF NOT EXISTS instellingen (
    id SERIAL PRIMARY KEY,
    sleutel VARCHAR(255) NOT NULL UNIQUE,
    waarde TEXT,
    beschrijving TEXT,
    categorie VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for authenticated users
-- Allow all operations for authenticated users (you can make this more restrictive later)

-- Regio policies
CREATE POLICY "Enable all operations for authenticated users" ON regio
    FOR ALL USING (auth.role() = 'authenticated');

-- Campagnes policies
CREATE POLICY "Enable all operations for authenticated users" ON campagnes
    FOR ALL USING (auth.role() = 'authenticated');

-- Klanten policies
CREATE POLICY "Enable all operations for authenticated users" ON klanten
    FOR ALL USING (auth.role() = 'authenticated');

-- Verkopers policies
CREATE POLICY "Enable all operations for authenticated users" ON verkopers
    FOR ALL USING (auth.role() = 'authenticated');

-- Gesprekken policies
CREATE POLICY "Enable all operations for authenticated users" ON gesprekken
    FOR ALL USING (auth.role() = 'authenticated');

-- Belschema policies
CREATE POLICY "Enable all operations for authenticated users" ON belschema
    FOR ALL USING (auth.role() = 'authenticated');

-- Logs policies
CREATE POLICY "Enable all operations for authenticated users" ON logs
    FOR ALL USING (auth.role() = 'authenticated');

-- Rapporten policies
CREATE POLICY "Enable all operations for authenticated users" ON rapporten
    FOR ALL USING (auth.role() = 'authenticated');

-- Instellingen policies
CREATE POLICY "Enable all operations for authenticated users" ON instellingen
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert some sample data for testing

-- Sample regio data
INSERT INTO regio (naam, code, beschrijving, actief) VALUES
('Noord-Holland', 'NH', 'Noord-Holland regio', true),
('Zuid-Holland', 'ZH', 'Zuid-Holland regio', true),
('Utrecht', 'UT', 'Utrecht regio', true),
('Gelderland', 'GL', 'Gelderland regio', true)
ON CONFLICT (code) DO NOTHING;

-- Sample campagnes data
INSERT INTO campagnes (naam, beschrijving, start_datum, eind_datum, budget, status) VALUES
('Zomer Campagne 2024', 'Zomer promotie campagne', '2024-06-01', '2024-08-31', 50000.00, 'actief'),
('Winter Actie', 'Winter verkoop campagne', '2024-12-01', '2025-02-28', 30000.00, 'actief')
ON CONFLICT DO NOTHING;

-- Sample klanten data
INSERT INTO klanten (naam, email, telefoon, adres, regio_id, status) VALUES
('Jan Jansen', 'jan@example.com', '020-1234567', 'Hoofdstraat 1, Amsterdam', 1, 'actief'),
('Piet Pietersen', 'piet@example.com', '010-7654321', 'Kerkstraat 10, Rotterdam', 2, 'actief'),
('Marie de Vries', 'marie@example.com', '030-1112223', 'Schoolstraat 5, Utrecht', 3, 'prospect')
ON CONFLICT (email) DO NOTHING;

-- Sample verkopers data
INSERT INTO verkopers (naam, email, telefoon, regio_id, commissie_percentage, actief) VALUES
('Klaas Verkoper', 'klaas@example.com', '020-9998887', 1, 10.00, true),
('Lisa Sales', 'lisa@example.com', '010-7776665', 2, 12.50, true),
('Mark Handelaar', 'mark@example.com', '030-5554443', 3, 8.75, true)
ON CONFLICT (email) DO NOTHING;

-- Sample belschema data
INSERT INTO belschema (naam, beschrijving, start_tijd, eind_tijd, actief) VALUES
('Ochtend Schema', 'Ochtend belrondes', '09:00:00', '12:00:00', true),
('Middag Schema', 'Middag belrondes', '13:00:00', '17:00:00', true)
ON CONFLICT DO NOTHING;

-- Sample instellingen data
INSERT INTO instellingen (sleutel, waarde, beschrijving, categorie) VALUES
('bedrijfsnaam', 'Auria Admin', 'Naam van het bedrijf', 'algemeen'),
('contact_email', 'info@auria.nl', 'Contact email adres', 'contact'),
('max_klanten_per_verkoper', '50', 'Maximum aantal klanten per verkoper', 'verkoop')
ON CONFLICT (sleutel) DO NOTHING; 