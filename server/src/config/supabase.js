import { createClient } from '@supabase/supabase-js';
import config from './env.js';

/**
 * Supabase Client Configuration
 * 
 * IMPORTANT SECURITY:
 * The SUPABASE_SERVICE_ROLE_KEY is used exclusively by this backend service.
 * It must NEVER be bundled or sent to the React frontend client.
 */

const supabaseUrl = config.supabaseUrl;
// Prioritize service-role key for backend admin operations, fallback to anon key
const supabaseKey = config.supabaseServiceRoleKey || config.supabaseAnonKey;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

if (!isSupabaseConfigured()) {
  console.warn(
    '[Supabase Notice] SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not set in server/.env.'
  );
}

export default supabase;
