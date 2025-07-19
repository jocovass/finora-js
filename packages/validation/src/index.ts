import { z } from 'zod';

export interface ApiMeta {
	current_page: number;
	next_page: null | number;
	per_page: number;
	prev_page: null | number;
	total_count: number;
	total_pages: number;
}

export type FieldError = { error: string[]; field: string };

export type ApiErrorResponse = {
	error: {
		fields?: FieldError[];
		message?: string;
	};
	status: 'error';
};

export interface ApiSuccessResponse {
	data: unknown;
	meta?: ApiMeta;
	status: 'success';
}

export type ApiResponse = ApiErrorResponse | ApiSuccessResponse;

export const SigninPayload = z.object({
	email: z.string().email('Invalid email format'),
});

export const VerificationPayload = z.object({
	otp: z.string(),
	verificationId: z.string(),
});
