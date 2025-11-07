import {createClient} from '@supabase/supabase-js';

const supabaseUrl = backend.env.SUPABASE_URL;
const supabaseAnonKey = backend.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



