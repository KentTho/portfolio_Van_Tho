import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getCareerAdminUseCases } from "@/composition/career";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { CertificationForm } from "../certification-form";

export const dynamic = "force-dynamic";

// Certifications have no single-get use-case; resolve by listing (small owner dataset).
export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const list = await getCareerAdminUseCases().certifications.list.execute({ admin });
  if (!isOk(list)) notFound();
  const certification = list.value.find((c) => c.id === id);
  if (!certification) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa chứng chỉ" description={certification.name} />
      <CertificationForm certification={certification} />
    </div>
  );
}
