import 'dotenv/config';
import { name } from '@repo/validation';
import express from 'express';

import { app as appp } from './app';

const app = express();

app.get('/health', (req, res) => {
	res.send(`We are up and running 🎉 ${process.env.NODE_ENV!}`);
});

app.listen(8000, () => {
	console.log('The author iss ', name);
	console.log(JSON.stringify(appp));
	console.log('API is running on port 8000');
});
