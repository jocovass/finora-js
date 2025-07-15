import { z } from 'zod';

const envSchema = z.object({
	DB_APP_USER: z.string(),
	DB_APP_PASSWORD: z.string(),
	DB_HOST: z.string(),
	DB_NAME: z.string(),
	DB_PORT: z.string().transform(dbPort => Number.parseInt(dbPort)),
	DB_SSL: z.string(),
	DB_TIMEZONE: z.string(),
	DB_URL: z.string(),
	FRONTEND_URL: z.string(),
	PORT: z.string().transform(port => Number.parseInt(port)),
	NODE_ENV: z.string(),
});

function parseEnv() {
	const result = envSchema.safeParse(process.env);

	if (!result.success) {
		throw result.error;
	}

	return result.data;
}

export const parsedEnv = parseEnv();
