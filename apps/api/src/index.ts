import 'dotenv/config';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { parsedEnv } from './utils/parse-env';

const app = express();

app.disable('x-powered-by');

app.use(
	cors({
		origin: [parsedEnv.FRONTEND_URL],
	}),
);

app.use(helmet());

app.use(
	json({
		limit: '10mb',
	}),
);

if (parsedEnv.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
	res.send(`We are up and running 🎉 ${process.env.NODE_ENV!}`);
});

app.listen(parsedEnv.PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`API is running on port ${parsedEnv.PORT} 🚀`);
});
