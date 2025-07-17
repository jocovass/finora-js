import 'dotenv/config';
import cors from 'cors';
import express, { json } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { apiRouter } from './routes/index';
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

// API
app.use(apiRouter);

// TODO: unhandled route, error handler

app.listen(parsedEnv.PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`API is running on port ${parsedEnv.PORT} 🚀`);
});
