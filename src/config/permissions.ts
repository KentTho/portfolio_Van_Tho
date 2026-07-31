import type { Brand } from "@/shared/types";

/** Application permissions. Enforced per use case; never trusted from the client. */
export const PERMISSIONS = [
  "content.read",
  "content.write",
  "content.publish",
  "media.write",
  "messages.read",
  "settings.write",
  "audit.read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];
export type AdminEmail = Brand<string, "AdminEmail">;

/** Role → permission map. `owner_admin` has everything; `editor` is content-only (V1: disabled). */
export const ROLE_PERMISSIONS: Record<"owner_admin" | "editor" | "viewer", readonly Permission[]> = {
  owner_admin: [...PERMISSIONS],
  editor: ["content.read", "content.write", "content.publish", "media.write", "messages.read"],
  viewer: ["content.read", "messages.read", "audit.read"],
};

/** Pure role→permission check. Never trust a permission asserted by the client. */
export function hasPermission(
  role: keyof typeof ROLE_PERMISSIONS,
  permission: Permission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
