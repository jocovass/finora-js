import { UTCDate } from '@date-fns/utc';
import { generateTOTP } from '@epic-web/totp';

import { db } from '../../db/database';
import { verifications } from '../../db/schemas';

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
}: PrepareTOTP): Promise<string> {
	const { otp, ...totpConfig } = await generateTOTP({
		algorithm: 'SHA256',
		charSet: 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789',
		period,
	});

	const verificationConfig = {
		type,
		target,
		...totpConfig,
		expiresAt: new UTCDate(Date.now() + period * 1000),
	};

	await db
		.insert(verifications)
		.values(verificationConfig)
		.onConflictDoUpdate({
			target: [verifications.target, verifications.type],
			set: verificationConfig,
		});

	return otp;
}
