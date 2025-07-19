import { z } from 'zod';

const envSchema = z.object({
	APP_NAME: z.string(),
	DB_APP_USER: z.string(),
	DB_APP_PASSWORD: z.string(),
	DB_HOST: z.string(),
	DB_NAME: z.string(),
	DB_PORT: z.string().transform(dbPort => Number.parseInt(dbPort)),
	DB_SSL: z.string(),
	DB_TIMEZONE: z.string(),
	DB_URL: z.string(),
	FRONTEND_URL: z.string(),
	MOCK: z.boolean().optional().default(false),
	NODE_ENV: z.string(),
	PORT: z.string().transform(port => Number.parseInt(port)),
	RESEND_API_KEY: z.string(),
});

function parseEnv() {
	const result = envSchema.safeParse(process.env);

	if (!result.success) {
		throw result.error;
	}

	return result.data;
}

export const parsedEnv = parseEnv();
