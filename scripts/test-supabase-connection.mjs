import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabase = createClient(url, key);

(async () => {
  try {
    console.log('Testing connection to', url);
    const { data, error } = await supabase.from('blackjack_lobbies').select('*').limit(1);
    if (error) {
      console.error('Query returned error:', error.message || error);
      process.exit(2);
    }
    console.log('Query succeeded, rows returned:', Array.isArray(data) ? data.length : 0);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(3);
  }
})();
