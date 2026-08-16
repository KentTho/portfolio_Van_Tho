import "server-only";
import type { AuditLogPort } from "@/shared/application/audit-log-port";
import { writeAuditLog } from "@/infrastructure/logging/audit-writer";
import { DrizzleCareerRepository } from "@/modules/career/infrastructure/drizzle-career-repository";
import {
  ArchiveCertification,
  ArchiveEducation,
  ArchiveExperience,
  CreateCertification,
  CreateEducation,
  CreateExperience,
  GetExperience,
  ListCertifications,
  ListEducation,
  ListExperiences,
  UpdateCertification,
  UpdateEducation,
  UpdateExperience,
} from "@/modules/career/application/use-cases/career-use-cases";

const audit: AuditLogPort = {
  record: (entry) =>
    writeAuditLog({
      actorUserId: entry.actorUserId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata ?? null,
    }),
};

/** Composition root for the career module (experiences, education, certifications). */
export function getCareerAdminUseCases() {
  const repo = new DrizzleCareerRepository();
  return {
    experiences: {
      list: new ListExperiences({ repo }),
      get: new GetExperience({ repo }),
      create: new CreateExperience({ repo, audit }),
      update: new UpdateExperience({ repo, audit }),
      archive: new ArchiveExperience({ repo, audit }),
    },
    education: {
      list: new ListEducation({ repo }),
      create: new CreateEducation({ repo, audit }),
      update: new UpdateEducation({ repo, audit }),
      archive: new ArchiveEducation({ repo, audit }),
    },
    certifications: {
      list: new ListCertifications({ repo }),
      create: new CreateCertification({ repo, audit }),
      update: new UpdateCertification({ repo, audit }),
      archive: new ArchiveCertification({ repo, audit }),
    },
  };
}
