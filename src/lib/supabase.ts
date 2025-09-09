import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jlmfkgmluwkbfcapjsni.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbWZrZ21sdXdrYmZjYXBqc25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTU3ODIsImV4cCI6MjA3MzAzMTc4Mn0.RKNUviCI45FL5C80OK5EfY6rq42hxc7l2e7Er9ooipg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
