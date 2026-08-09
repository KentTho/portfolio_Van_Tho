CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"issuer" text NOT NULL,
	"issue_date" date,
	"expiry_date" date,
	"credential_id" text,
	"credential_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"row_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"institution" text NOT NULL,
	"degree" text,
	"field_of_study" text,
	"start_date" date,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"row_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"experience_id" uuid NOT NULL,
	"locale" text NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "experience_translations_exp_locale_uq" UNIQUE("experience_id","locale"),
	CONSTRAINT "experience_translations_locale_ck" CHECK ("experience_translations"."locale" in ('vi','en'))
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization" text NOT NULL,
	"employment_type" text,
	"location" text,
	"url" text,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_current" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"row_version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "experience_translations" ADD CONSTRAINT "experience_translations_experience_id_experiences_id_fk" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "certifications_visible_sort_idx" ON "certifications" USING btree ("is_visible","sort_order");--> statement-breakpoint
CREATE INDEX "education_visible_sort_idx" ON "education" USING btree ("is_visible","sort_order");--> statement-breakpoint
CREATE INDEX "experiences_visible_sort_idx" ON "experiences" USING btree ("is_visible","sort_order");