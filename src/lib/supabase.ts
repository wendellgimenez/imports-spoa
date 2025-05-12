import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Criar o cliente Supabase apenas se as variáveis de ambiente estiverem disponíveis
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Função auxiliar para verificar se o Supabase está configurado
export const isSupabaseConfigured = () => {
  return !!supabase
} 