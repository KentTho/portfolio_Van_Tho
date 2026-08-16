import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getCareerAdminUseCases } from "@/composition/career";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { ExperienceForm } from "../experience-form";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const result = await getCareerAdminUseCases().experiences.get.execute({ admin, id });
  if (!isOk(result)) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa kinh nghiệm" description={result.value.experience.organization} />
      <ExperienceForm aggregate={result.value} />
    </div>
  );
}
