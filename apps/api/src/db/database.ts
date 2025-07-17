import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schemas from './schemas';
import { parsedEnv } from '../utils/parse-env';

const dbUrl = new URL(parsedEnv.DB_URL);

const client = new Pool({
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
export const db = drizzle(client, { schema: schemas });

export type DB = typeof db;
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
