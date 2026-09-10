CREATE TABLE "ai_scheme_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_prompt" text NOT NULL,
	"matched_scheme_ids" uuid[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "channel_partners" (
	"ifsc" text PRIMARY KEY NOT NULL,
	"bank" text NOT NULL,
	"branch" text NOT NULL,
	"partner_type" text NOT NULL,
	"nodal_officer" text,
	"contact" text,
	"address" text,
	"district" text,
	"state" text NOT NULL,
	"geography" geometry(point),
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scheme_id" uuid NOT NULL,
	"readiness_score" integer,
	"status" text DEFAULT 'pending' NOT NULL,
	"uploaded_documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"missing_documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ai_summary" text,
	"document_feedback" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loan_dossiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_code" text NOT NULL,
	"applicant_name" text NOT NULL,
	"phone_hash" text NOT NULL,
	"annual_income" numeric NOT NULL,
	"project_cost" numeric NOT NULL,
	"calculated_emi" numeric NOT NULL,
	"eligible_scheme_id" uuid NOT NULL,
	"allocated_partner_ifsc" text NOT NULL,
	"selected_moratorium" integer,
	"status" text DEFAULT 'DOSSIER_GENERATED' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "loan_dossiers_tracking_code_unique" UNIQUE("tracking_code")
);
--> statement-breakpoint
CREATE TABLE "partner_health_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ifsc" text NOT NULL,
	"fiscal_cycle" text NOT NULL,
	"allocated_quota" numeric NOT NULL,
	"disbursed_quota" numeric NOT NULL,
	"npa_ratio" numeric NOT NULL,
	"is_frozen" boolean DEFAULT false NOT NULL,
	"audit_timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_health_metrics_ifsc_fiscal_cycle_key" UNIQUE("ifsc","fiscal_cycle")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"age" integer NOT NULL,
	"gender" text,
	"state" text NOT NULL,
	"district" text,
	"occupation" text NOT NULL,
	"employment_status" text,
	"annual_income" numeric,
	"education" text,
	"preferred_language" text,
	"purpose" text,
	"requested_amount" numeric,
	"project_cost" numeric,
	"category" text,
	"profile_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "saved_schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scheme_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "saved_schemes_user_id_scheme_id_key" UNIQUE("user_id","scheme_id")
);
--> statement-breakpoint
CREATE TABLE "schemes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"target_group" text NOT NULL,
	"benefits" text NOT NULL,
	"eligibility" text NOT NULL,
	"application_process" text NOT NULL,
	"required_documents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"official_url" text,
	"start_date" date,
	"end_date" date,
	"ministry" text NOT NULL,
	"scheme_type" text NOT NULL,
	"occupation_tags" text[] DEFAULT '{}' NOT NULL,
	"state_tags" text[] DEFAULT '{}' NOT NULL,
	"gender_tags" text[] DEFAULT '{}' NOT NULL,
	"education_tags" text[] DEFAULT '{}' NOT NULL,
	"age_min" integer,
	"age_max" integer,
	"min_cost" numeric,
	"max_cost" numeric,
	"income_limit" numeric,
	"interest_rate_male" numeric,
	"interest_rate_female" numeric,
	"govt_funding_pct" numeric,
	"promoter_margin_pct" numeric,
	"min_moratorium" integer,
	"max_moratorium" integer,
	"max_tenure_months" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schemes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "ai_scheme_searches" ADD CONSTRAINT "ai_scheme_searches_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_checks" ADD CONSTRAINT "document_checks_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_checks" ADD CONSTRAINT "document_checks_scheme_id_schemes_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."schemes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_dossiers" ADD CONSTRAINT "loan_dossiers_eligible_scheme_id_schemes_id_fk" FOREIGN KEY ("eligible_scheme_id") REFERENCES "public"."schemes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loan_dossiers" ADD CONSTRAINT "loan_dossiers_allocated_partner_ifsc_channel_partners_ifsc_fk" FOREIGN KEY ("allocated_partner_ifsc") REFERENCES "public"."channel_partners"("ifsc") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_health_metrics" ADD CONSTRAINT "partner_health_metrics_ifsc_channel_partners_ifsc_fk" FOREIGN KEY ("ifsc") REFERENCES "public"."channel_partners"("ifsc") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_schemes" ADD CONSTRAINT "saved_schemes_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_schemes" ADD CONSTRAINT "saved_schemes_scheme_id_schemes_id_fk" FOREIGN KEY ("scheme_id") REFERENCES "public"."schemes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_scheme_searches_user_id_idx" ON "ai_scheme_searches" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "channel_partners_geography_idx" ON "channel_partners" USING gist ("geography");--> statement-breakpoint
CREATE INDEX "channel_partners_state_idx" ON "channel_partners" USING btree ("state");--> statement-breakpoint
CREATE INDEX "document_checks_user_id_idx" ON "document_checks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_checks_scheme_id_idx" ON "document_checks" USING btree ("scheme_id");--> statement-breakpoint
CREATE INDEX "saved_schemes_user_id_idx" ON "saved_schemes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "schemes_occupation_tags_idx" ON "schemes" USING gin ("occupation_tags");--> statement-breakpoint
CREATE INDEX "schemes_state_tags_idx" ON "schemes" USING gin ("state_tags");--> statement-breakpoint
CREATE INDEX "schemes_gender_tags_idx" ON "schemes" USING gin ("gender_tags");--> statement-breakpoint
CREATE INDEX "schemes_education_tags_idx" ON "schemes" USING gin ("education_tags");--> statement-breakpoint
CREATE INDEX "schemes_start_date_idx" ON "schemes" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "schemes_end_date_idx" ON "schemes" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "schemes_is_active_idx" ON "schemes" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "schemes_category_idx" ON "schemes" USING btree ("category");