CREATE TYPE "public"."app_role" AS ENUM('owner_admin', 'editor', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('new', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."media_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'review', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."project_visibility" AS ENUM('public', 'unlisted', 'private');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended', 'disabled');--> statement-breakpoint
CREATE TABLE "app_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_auth_user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"display_name" text,
	"role" "app_role" DEFAULT 'owner_admin' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"credentials_revoked_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "app_users_supabase_auth_user_id_unique" UNIQUE("supabase_auth_user_id"),
	CONSTRAINT "app_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"singleton_key" text DEFAULT 'primary' NOT NULL,
	"full_name" text DEFAULT '' NOT NULL,
	"professional_title" text DEFAULT '' NOT NULL,
	"location" text,
	"public_email" text,
	"availability_status" text DEFAULT 'unknown' NOT NULL,
	"default_locale" text DEFAULT 'vi' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_singleton_key_unique" UNIQUE("singleton_key")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"visibility" "project_visibility" DEFAULT 'private' NOT NULL,
	"category" text DEFAULT 'software' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"featured_order" integer,
	"role" text,
	"github_url" text,
	"live_url" text,
	"video_url" text,
	"cover_media_id" uuid,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"row_version" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bucket" text NOT NULL,
	"object_path" text NOT NULL,
	"mime_type" text NOT NULL,
	"byte_size" integer DEFAULT 0 NOT NULL,
	"alt_text" text DEFAULT '' NOT NULL,
	"visibility" "media_visibility" DEFAULT 'private' NOT NULL,
	"upload_status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"proficiency_label" text,
	"evidence_text" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	CONSTRAINT "skills_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"subject" text,
	"message" text NOT NULL,
	"locale" text DEFAULT 'vi' NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"source_page" text,
	"ip_hash" text,
	"turnstile_verified" boolean DEFAULT false NOT NULL,
	"email_delivery_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"request_id" text,
	"metadata_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value_json" jsonb NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "projects_status_published_idx" ON "projects" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured","featured_order");--> statement-breakpoint
CREATE UNIQUE INDEX "media_bucket_path_idx" ON "media_assets" USING btree ("bucket","object_path");--> statement-breakpoint
CREATE INDEX "contact_status_created_idx" ON "contact_messages" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "audit_actor_created_idx" ON "audit_logs" USING btree ("actor_user_id","created_at");