import { z } from 'zod';

import { parsedEnv } from '../../utils/parse-env';

const from = 'onboarding@resend.dev';

export const resendErrorSchema = z.union([
	z
		.object({
			error: z.string(),
			statusCode: z.number(),
		})
		.transform(data => ({
			message: data.error,
			statusCode: data.statusCode,
		})),
	z.object({
		name: z.string(),
		message: z.string(),
		statusCode: z.number(),
	}),
	z.object({
		name: z.literal('UnknownError'),
		message: z.literal('UnknownError'),
		statusCode: z.literal(500),
		cause: z.any(),
	}),
]);

export type ResendError = z.infer<typeof resendErrorSchema>;

export const resendSuccessSchema = z.object({
	id: z.string(),
});

export type SendEmail = {
	html: string;
	text: string;
	to: string;
	subject: string;
};
export async function sendEmail(props: SendEmail) {
	const email = {
		...props,
		from,
	};

	if (parsedEnv.NODE_ENV === 'development' || parsedEnv.MOCK) {
		// eslint-disable-next-line no-console
		console.log('We are not sending actuall emails during development 📩');
		// eslint-disable-next-line no-console
		console.log('Signup email template: ', JSON.stringify(email.html));
		return {
			status: 'success',
			data: { id: 'mocked' },
		} as const;
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${parsedEnv.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(email),
	});
	const data = await response.json();
	const parsedData = resendSuccessSchema.safeParse(data);

	if (response.ok && parsedData.success) {
		return {
			status: 'success',
			data: { id: parsedData.data.id },
		} as const;
	} else {
		const parsedError = resendErrorSchema.safeParse(data);
		if (parsedError.success) {
			return {
				status: 'error',
				error: parsedError.data,
			} as const;
		} else {
			return {
				status: 'error',
				error: {
					name: 'UnknownError',
					message: 'UnknownError',
					statusCode: 500,
					cause: data,
				} satisfies ResendError,
			} as const;
		}
	}
}
