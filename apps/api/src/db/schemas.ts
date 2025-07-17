import { UTCDate } from '@date-fns/utc';
import { createId as cuid } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import {
	date,
	index,
	integer,
	pgSchema,
	text,
	timestamp,
	unique,
	varchar,
} from 'drizzle-orm/pg-core';

export const finoraSchema = pgSchema('finora');

export const verificationStatuses = finoraSchema.enum(
	'verification_status_enum',
	['idle', 'pending', 'approved', 'rejected'],
);

export const users = finoraSchema.table('users', {
	id: varchar('id', { length: 25 })
		.primaryKey()
		.$default(() => cuid()),
	email: text('email').unique().notNull(),
	kycStatus: verificationStatuses('kyc_status').default('idle').notNull(),
	passwordHash: text('password_hash'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new UTCDate())
		.notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
	user_details: one(userDetails, {
		fields: [users.id],
		references: [userDetails.userId],
	}),
	kyc_documents: many(kycDocuments, {
		relationName: 'kyc_documents',
	}),
}));

export const userDetails = finoraSchema.table('user_details', {
	id: varchar('id', { length: 25 })
		.primaryKey()
		.$default(() => cuid()),
	userId: varchar('user_id', { length: 25 })
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.unique()
		.notNull(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	dateOfBirth: date('date_of_birth').notNull(),
	phoneNumber: text('phone_number').notNull(),
	postCode: text('post_code').notNull(),
	country: text('country').notNull(),
	city: text('city').notNull(),
	addressLineOne: text('address_line_one').notNull(),
	addressLineTwo: text('address_line_two'),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.defaultNow()
		.$onUpdateFn(() => new UTCDate())
		.notNull(),
});

export const kycDocumentTypes = finoraSchema.enum('kyc_document_type', [
	'identification',
	'face_scan',
	'proof_of_address',
]);

export const kycDocuments = finoraSchema.table(
	'kyc_documents',
	{
		id: varchar('id', { length: 25 })
			.primaryKey()
			.$default(() => cuid()),
		userId: varchar('user_id', { length: 25 })
			.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
			.notNull(),

		documentType: kycDocumentTypes('document_type').notNull(),
		fileName: text('file_name').notNull(),
		filePath: text('file_path').notNull(),
		fileSize: integer('file_size'),
		mimeType: varchar('mime_type', { length: 50 }),
		fileHash: varchar('file_hash', { length: 32 }),

		verificationStatus: verificationStatuses('verification_status')
			.default('pending')
			.notNull(),
		rejectionReason: text('rejection_reason'),

		createdAt: timestamp('created_at', { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { withTimezone: true })
			.defaultNow()
			.$onUpdateFn(() => new UTCDate())
			.notNull(),
	},
	table => [index('kyc_documents_user_id_idx').on(table.userId)],
);

export const kycDocumentRelations = relations(kycDocuments, ({ one }) => ({
	user_details: one(users, {
		fields: [kycDocuments.userId],
		references: [users.id],
		relationName: 'kyc_documents',
	}),
}));

export const verifications = finoraSchema.table(
	'verifications',
	{
		id: varchar('id', { length: 25 })
			.primaryKey()
			.$default(() => cuid()),
		/**
		 * The type of verification, e.g. "email", "phone" or "onboarding"
		 */
		type: text('type').notNull(),
		/**
		 * The thing we're trying to verify, e.g. a user's email or phone number
		 */
		target: text('target').notNull(),
		/**
		 * The secret key used to generate the otp
		 */
		secret: text('secret').notNull(),
		/**
		 * The algorithm used to generate the otp
		 */
		algorithm: text('algorithm').notNull(),
		/**
		 * The number of digits in the otp
		 */
		digits: integer('digits').notNull(),
		/**
		 * The number of seconds the otp is valid for
		 */
		period: integer('period').notNull(),
		/**
		 * The valid characters for the otp
		 */
		charSet: text('charSet').notNull(),
		/**
		 * When it's safe to delete this verification
		 */
		expiresAt: timestamp('expiresAt', { withTimezone: true }),
		createdAt: timestamp('createdAt', { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp('updatedAt', { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdateFn(() => new UTCDate()),
	},
	table => [unique('unique_target_type').on(table.target, table.type)],
);
