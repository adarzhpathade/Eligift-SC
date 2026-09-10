ALTER TABLE "loan_dossiers" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "loan_dossiers" ADD CONSTRAINT "loan_dossiers_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "loan_dossiers_user_id_idx" ON "loan_dossiers" USING btree ("user_id");