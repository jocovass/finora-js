import { SigninPayload, VerificationPayload } from '@repo/validation';
import { eq } from 'drizzle-orm';
import { Router } from 'express';

import { db } from '../db/database';
import { users } from '../db/schemas';
import { sendEmail } from '../services/email/resend';
import {
	getLoginEmailHtml,
	getLoginEmailText,
} from '../services/email/template';
import { isOtpCodeValid, prepareTOTP } from '../services/verification';
import { formatFieldError } from '../utils/formatFieldError';

export const authRouter: Router = Router();

authRouter.post('/signin', async (req, res) => {
	const parsedResult = SigninPayload.safeParse(req.body);
	if (!parsedResult.success) {
		res.status(400).json({
			status: 'error',
			error: {
				fields: formatFieldError(parsedResult.error),
				message: 'Invalid sign in request',
			},
		});
		return;
	}
	const { email } = parsedResult.data;
	const { otp, verificationId } = await prepareTOTP({
		type: 'login',
		target: email,
	});
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
		data: { verificationId },
	});
});

authRouter.post('/verify', async (req, res) => {
	const parsedResult = VerificationPayload.safeParse(req.body);
	if (!parsedResult.success) {
		res.status(400).json({
			status: 'error',
			error: {
				fields: formatFieldError(parsedResult.error),
				message: 'Invalid verification request',
			},
		});
		return;
	}
	const { otp, verificationId } = parsedResult.data;
	const verificationResult = await isOtpCodeValid({ otp, verificationId });
	if (verificationResult.status === 'error') {
		res.status(400).json(verificationResult);
		return;
	}
	let user = await db.query.users.findFirst({
		where: eq(users.email, verificationResult.data.target),
	});
	user ??= (
		await db
			.insert(users)
			.values({
				email: verificationResult.data.target,
			})
			.returning()
	)[0];
	res.status(200).json({
		status: 'success',
		data: user,
	});
});
