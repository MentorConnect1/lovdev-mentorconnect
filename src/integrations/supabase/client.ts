import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://knkclotptwudbqdwjqxp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtua2Nsb3RwdHd1ZGJxZHdqcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTQ1NjUsImV4cCI6MjA4Nzg3MDU2NX0.dk9OlP3DMP_Rw5cvxvlUYGEuEngnerdpNXu9iNI9ibc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
