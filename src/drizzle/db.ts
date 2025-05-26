import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
import { NewNotebook, notebooks } from './schema';

export const db = drizzle(sql, { schema });

export const insertNewNotebook = async (data: NewNotebook) => {
  return db.insert(notebooks).values(data).returning();
};
