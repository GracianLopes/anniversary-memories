const SUPABASE_URL = 'https://swjtjuhoxjxffodlcrrg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3anRqdWhveGp4ZmZvZGxjcnJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTIxMzcsImV4cCI6MjA4OTQyODEzN30.R4p-U0_dRLdG4Xv_R5Rffmtj6E_WvRPv3IVYIg69Rdo';

// Initialize Supabase client (no auth/session needed for public sharing)
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
