import { UTCDate } from '@date-fns/utc';
import { generateTOTP, verifyTOTP } from '@epic-web/totp';
import type { ApiErrorResponse } from '@repo/validation';
import { eq } from 'drizzle-orm';

import { db } from '../../db/database';
import { type SelectVerification, verifications } from '../../db/schemas';
import { simulateProcessing } from '../../utils';

/**
 * 10 minutes
 */
export const verificationMaxAge = 60 * 10;

export type VerificationTypes = 'login';

export type PrepareTOTP = {
	/**
	 * Number of seconds the "otp" is valid for.
	 * @default `10 * 60 = 10 minutes`
	 */
	period?: number;
	/**
	 * The type of verification, e.g. "onbaording".
	 */
	type: VerificationTypes;
	/**
	 * The value of the thing we are trying to validate.
	 * @example `email => "piggybank@gmail.com"'
	 */
	target: string;
};
export async function prepareTOTP({
	period = verificationMaxAge,
	type,
	target,
}: PrepareTOTP): Promise<{ otp: string; verificationId: string }> {
	const { otp, ...totpConfig } = await generateTOTP({
		algorithm: 'SHA-256',
		period,
	});

	const verificationConfig = {
		type,
		target,
		...totpConfig,
		expiresAt: new UTCDate(Date.now() + period * 1000),
	};

	const record = await db
		.insert(verifications)
		.values(verificationConfig)
		.onConflictDoUpdate({
			target: [verifications.target, verifications.type],
			set: verificationConfig,
		})
		.returning({ id: verifications.id });

	return { otp, verificationId: record[0]?.id as string };
}

export type IsOtpCodeValidReturn = Promise<
	| ApiErrorResponse
	| {
			status: 'success';
			data: Omit<
				SelectVerification,
				'id' | 'createdAt' | 'updatedAt' | 'expiresAt' | 'type'
			>;
	  }
>;
export async function isOtpCodeValid({
	otp,
	verificationId,
}: {
	otp: string;
	verificationId: string;
}): IsOtpCodeValidReturn {
	const record = await db.query.verifications.findFirst({
		columns: {
			algorithm: true,
			charSet: true,
			digits: true,
			period: true,
			secret: true,
			target: true,
		},
		where: (table, { and, eq, gt }) =>
			and(eq(table.id, verificationId), gt(table.expiresAt, new UTCDate())),
	});
	const verificationResult = record
		? await verifyTOTP({
				otp,
				...record,
			})
		: await simulateProcessing();
	if (!record || !verificationResult) {
		return {
			status: 'error',
			error: {
				message: 'Invalid verification attempt',
			},
		};
	}
	await db.delete(verifications).where(eq(verifications.id, verificationId));
	return {
		status: 'success',
		data: record,
	};
}
