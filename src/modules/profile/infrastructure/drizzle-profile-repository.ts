import "server-only";
import { eq } from "drizzle-orm";
import type { Locale } from "@/shared/domain/locale";
import type { AvailabilityStatus, Profile } from "@/modules/profile/domain/profile";
import type { ProfileRepositoryPort } from "@/modules/profile/application/ports/profile-repository-port";
import type { ProfileUpdateInput } from "@/modules/profile/application/profile-schema";
import { getDb } from "@/infrastructure/database/client";
import { profiles, type ProfileRow } from "@/infrastructure/database/schema";

const SINGLETON = "primary";

const DEFAULT_PROFILE: Profile = {
  fullName: "",
  professionalTitle: "",
  location: null,
  publicEmail: null,
  availabilityStatus: "unknown",
  defaultLocale: "vi",
};

function toProfile(r: ProfileRow): Profile {
  return {
    fullName: r.fullName,
    professionalTitle: r.professionalTitle,
    location: r.location,
    publicEmail: r.publicEmail,
    availabilityStatus: r.availabilityStatus as AvailabilityStatus,
    defaultLocale: r.defaultLocale as Locale,
  };
}

function definedOnly<T extends Record<string, unknown>>(patch: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) out[k as keyof T] = v as T[keyof T];
  }
  return out;
}

/** Neon-backed singleton profile repository (Group 4). Upserts the single "primary" row. */
export class DrizzleProfileRepository implements ProfileRepositoryPort {
  async get(): Promise<Profile> {
    const rows = await getDb()
      .select()
      .from(profiles)
      .where(eq(profiles.singletonKey, SINGLETON))
      .limit(1);
    const row = rows[0];
    return row ? toProfile(row) : DEFAULT_PROFILE;
  }

  async update(patch: ProfileUpdateInput): Promise<Profile> {
    const set = { ...definedOnly(patch), updatedAt: new Date() };
    await getDb()
      .insert(profiles)
      .values({ singletonKey: SINGLETON, ...definedOnly(patch) })
      .onConflictDoUpdate({ target: profiles.singletonKey, set });
    return this.get();
  }
}
