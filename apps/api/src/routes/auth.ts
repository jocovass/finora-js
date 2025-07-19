import { SigninBody } from '@repo/validation';
import { Router } from 'express';

import { sendEmail } from '../services/email/resend';
import {
	getLoginEmailHtml,
	getLoginEmailText,
} from '../services/email/template';
import { prepareTOTP } from '../services/verification';
import { formatFieldError } from '../utils/formatFieldError';

export const authRouter: Router = Router();

authRouter.post('/signin', async (req, res) => {
	const parsedResult = SigninBody.safeParse(req.body);
	if (!parsedResult.success) {
		res.status(400).json({
			status: 'error',
			error: {
				fields: formatFieldError(parsedResult.error),
				message: 'Invalid signup information provided',
			},
		});
		return;
	}
	const { email } = parsedResult.data;
	const otp = await prepareTOTP({ type: 'login', target: email });
	const emailResult = await sendEmail({
		html: getLoginEmailHtml(otp),
		text: getLoginEmailText(otp),
		subject: `Your login code is ${otp}`,
		to: email,
	});
	if (emailResult.status === 'error') {
		res.status(emailResult.error.statusCode).json({
			status: 'error',
			error: {
				message: emailResult.error.message,
			},
		});
		return;
	}
	res.status(202).json({
		status: 'success',
		message: 'Verification code sent',
	});
});
