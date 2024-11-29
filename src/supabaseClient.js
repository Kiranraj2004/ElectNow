
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_REACT_SUPABASEURL
const supabaseKey = import.meta.env.VITE_REACT_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)