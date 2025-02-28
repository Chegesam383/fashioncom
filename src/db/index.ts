import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

console.log(process.env.DATABASE_URL);

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
