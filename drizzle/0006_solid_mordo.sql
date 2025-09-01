CREATE TYPE "public"."user-role" AS ENUM('student', 'admin');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user-role" DEFAULT 'student' NOT NULL;