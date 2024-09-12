// migrate.ts
import { config } from 'dotenv';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Load environment variables into the file
config();

const databaseUrl = drizzle(postgres(`${process.env.DATABASE_URL}`, { ssl: 'require', max: 1 }));

const main = async () => {
	try {
		await migrate(databaseUrl, { migrationsFolder: 'src/db/migrations' });
		console.log('Migration complete');
	} catch (error) {
		console.log('Migration failed:', error);
	}
	process.exit(0);
};

main();
