import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

export function createDbConnection(databaseUrl: string) {
	console.debug('creating database connection...', databaseUrl);
	const sql = neon(databaseUrl);
	return drizzle(sql, { schema });
}

export type DatabaseConnection = ReturnType<typeof createDbConnection>;
