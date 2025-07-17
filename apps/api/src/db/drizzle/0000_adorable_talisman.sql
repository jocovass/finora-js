CREATE SCHEMA "finora";
--> statement-breakpoint
CREATE TYPE "finora"."kyc_document_type" AS ENUM('identification', 'face_scan', 'proof_of_address');--> statement-breakpoint
CREATE TYPE "finora"."verification_status_enum" AS ENUM('idle', 'pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "finora"."kyc_documents" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"user_id" varchar(25) NOT NULL,
	"document_type" "finora"."kyc_document_type" NOT NULL,
	"file_name" text NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer,
	"mime_type" varchar(50),
	"file_hash" varchar(32),
	"verification_status" "finora"."verification_status_enum" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finora"."user_details" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"user_id" varchar(25) NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"phone_number" text NOT NULL,
	"post_code" text NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"address_line_one" text NOT NULL,
	"address_line_two" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_details_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "finora"."users" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"kyc_status" "finora"."verification_status_enum" DEFAULT 'idle' NOT NULL,
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "finora"."verifications" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"target" text NOT NULL,
	"secret" text NOT NULL,
	"algorithm" text NOT NULL,
	"digits" integer NOT NULL,
	"period" integer NOT NULL,
	"charSet" text NOT NULL,
	"expiresAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_target_type" UNIQUE("target","type")
);
--> statement-breakpoint
ALTER TABLE "finora"."kyc_documents" ADD CONSTRAINT "kyc_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finora"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "finora"."user_details" ADD CONSTRAINT "user_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finora"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "kyc_documents_user_id_idx" ON "finora"."kyc_documents" USING btree ("user_id");