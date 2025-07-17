import { Router } from 'express';
import { z } from 'zod';

export const authRouter: Router = Router();

const SignupBody = z.object({
	email: z.string().email('Invalid email format').optional(),
});

authRouter.post('/signup', (req, res) => {
	// validate email address
	// send verification email
});
