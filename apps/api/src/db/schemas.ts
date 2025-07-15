import { UTCDate } from '@date-fns/utc';
import { createId as cuid } from '@paralleldrive/cuid2';
import {
	boolean,
	date,
	pgSchema,
	text,
	timestamp,
	varchar,
} from 'drizzle-orm/pg-core';

export const finoraSchema = pgSchema('finora');

export const kycStatuses = finoraSchema.enum('kyc_status_enum', [
	'pending',
	'approved',
	'rejected',
]);

export const users = finoraSchema.table('users', {
	id: varchar('id', { length: 25 })
		.primaryKey()
		.$default(() => cuid()),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').unique().notNull(),
	passwordHash: text('password_hash').notNull(),
	dateOfBirth: date('date_of_birth').notNull(),
	phoneNumber: text('phone_number').notNull(),
	country: varchar('country', { length: 2 }).notNull(),
	isEmailVerified: boolean('is_email_verified').default(false).notNull(),
	kycStatus: kycStatuses('kyc_status').default('pending').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new UTCDate())
		.notNull(),
});
