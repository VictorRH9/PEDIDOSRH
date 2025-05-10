
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfzfdmbshdywfdiabkrt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmemZkbWJzaGR5d2ZkaWFia3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NjEyNzYsImV4cCI6MjA2MjMzNzI3Nn0.nW4qMfyc90G-1TQ4b82iQojDy-cR-cHZq7f6JH38bFw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
