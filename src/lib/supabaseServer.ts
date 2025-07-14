
import { createClient } from '@supabase/supabase-js';
import { getSecret } from 'astro:env/server'; 


const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = getSecret('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase server environment variables in supabaseServer.ts.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
