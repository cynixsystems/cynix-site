import { createClient } from "@supabase/supabase-js";

// Use variáveis de ambiente; se estiverem vazias, usa placeholders para o app não quebrar (login/cadastro só funcionam com .env.local configurado)
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "") || "https://placeholder.supabase.co";
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "") || "placeholder-anon-key";

/** true quando NEXT_PUBLIC_SUPABASE_URL e ANON_KEY estão preenchidos no .env.local */
export const isSupabaseConfigured =
  supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
