import 'dotenv/config';
import { type Config } from 'drizzle-kit';

export default {
	dbCredentials: {
		url: process.env.DB_URL,
	},
	dialect: 'postgresql',
	out: './src/db/drizzle',
	schema: './src/db/schemas.ts',
} satisfies Config;
