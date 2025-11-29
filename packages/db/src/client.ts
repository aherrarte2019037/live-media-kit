import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseKey = String(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const queryClient = postgres(connectionString, { prepare: false });
const supabase = createClient(supabaseUrl, supabaseKey);
const db = drizzle(queryClient, { schema });

export { supabase, db };
