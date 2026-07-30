import { pgEnum } from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", ["owner_admin", "editor", "viewer"]);
export const userStatus = pgEnum("user_status", ["active", "suspended", "disabled"]);
export const projectStatus = pgEnum("project_status", ["draft", "review", "published", "archived"]);
export const projectVisibility = pgEnum("project_visibility", ["public", "unlisted", "private"]);
export const mediaVisibility = pgEnum("media_visibility", ["public", "private"]);
export const contactStatus = pgEnum("contact_status", ["new", "read", "archived"]);
