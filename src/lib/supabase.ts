import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fuvtitcjzovzkknuuhcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1dnRpdGNqem92emtrbnV1aGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDY2ODYsImV4cCI6MjA2NzM4MjY4Nn0.y5mlR_RyjI0HbKaM754VVUoQNiS1O_n1EqzhGxPjwTM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 