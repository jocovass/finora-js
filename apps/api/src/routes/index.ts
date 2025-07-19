import { Router } from 'express';

import { authRouter } from './auth';

export const apiRouter: Router = Router();

apiRouter.use(authRouter);
