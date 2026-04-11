import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mxgipylcfcrarxqvsvqt.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14Z2lweWxjZmNyYXJ4cXZzdnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTg1MjQsImV4cCI6MjA5MDk5NDUyNH0._nROMzsTOcqQtTzNRNQ2iMoGw5E-nzxZb8X673yvXUg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
