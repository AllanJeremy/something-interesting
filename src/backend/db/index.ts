import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export const createDb = (databaseUrl: string) => {
	const sql = neon(databaseUrl);
	return drizzle(sql, { schema });
};
