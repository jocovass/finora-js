CREATE SCHEMA "finora";
--> statement-breakpoint
CREATE TYPE "finora"."kyc_status_enum" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "finora"."users" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"phone_number" text NOT NULL,
	"country" varchar(2) NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"kyc_status" "finora"."kyc_status_enum" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
