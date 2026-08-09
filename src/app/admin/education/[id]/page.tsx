import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getCareerAdminUseCases } from "@/composition/career";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { EducationForm } from "../education-form";

export const dynamic = "force-dynamic";

// Education has no single-get use-case; the owner's list is small, so resolve by listing.
export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const list = await getCareerAdminUseCases().education.list.execute({ admin });
  if (!isOk(list)) notFound();
  const education = list.value.find((e) => e.id === id);
  if (!education) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa học vấn" description={education.institution} />
      <EducationForm education={education} />
    </div>
  );
}
