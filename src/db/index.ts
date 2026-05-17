import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { registeredApp } from "@/src/db/schema/registered"
import { userBmr } from "./schema/userBmr";

const schema = {
    registeredApp,
    userBmr,
}

const pool = new Pool({
    host: process.env.SUPABASE_HOST!,
    port: 6543,
    user: process.env.SUPABASE_USER!,
    password: process.env.SUPABASE_DB_PASSWORD!,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    max: 1,
});

export const db = drizzle(pool, { schema });