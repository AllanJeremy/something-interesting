ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user_friends" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();