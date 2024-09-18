import type { Config } from 'drizzle-kit';

export default {
	schema: './src/backend/db/schema/index.ts',
	out: './src/backend/db/migrations',
	dialect: 'postgresql',
} satisfies Config;
