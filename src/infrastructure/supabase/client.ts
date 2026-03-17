import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.SUPABASE_ANON_KEY!;

if (!url || !serviceKey) throw new Error('Missing Supabase env vars');

/** Admin client — bypasses RLS */
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Anon — respects RLS */
export const supabaseAnon = createClient(url, anonKey);
