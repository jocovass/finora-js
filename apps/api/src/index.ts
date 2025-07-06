import { name } from '@repo/validation';
import express from 'express';

import { app as appp } from './app';

const app = express();

app.listen(8000, () => {
	console.log('The author is ', name);
	console.log(JSON.stringify(appp));
	console.log('API is running on port 8000');
});
