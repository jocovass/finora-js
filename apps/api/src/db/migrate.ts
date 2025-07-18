/* eslint-disable no-console */
/* eslint-disable n/no-process-exit */
import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Client } from 'pg';

async function main() {
	if (!process.env.DB_URL) {
		throw new Error('DB_URL missing can not proceed with the migration.');
	}

	const dbUrl = new URL(process.env.DB_URL);
	const client = new Client({
		database: dbUrl.pathname.slice(1),
		host: dbUrl.hostname,
		password: dbUrl.password,
		port: parseInt(dbUrl.port),
		ssl:
			process.env.NODE_ENV === 'development'
				? false
				: {
						rejectUnauthorized: false,
					},
		user: dbUrl.username,
	});
	try {
		await client.connect();
		const db = drizzle(client);
		await migrate(db, { migrationsFolder: './src/db/drizzle' });
		console.log('✅ Migration completed');
	} catch (e) {
		console.error('💥 Error during migraton: ', e);
		process.exit(1);
	} finally {
		await client.end();
	}
}

await main();
