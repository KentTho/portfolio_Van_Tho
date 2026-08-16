import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getProjectAdminUseCases } from "@/composition/projects";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { ProjectForm } from "../project-form";
import { loadTechOptions } from "../_load-tech";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const [result, technologies] = await Promise.all([
    getProjectAdminUseCases().get.execute({ admin, id }),
    loadTechOptions(admin),
  ]);
  if (!isOk(result)) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa dự án" description={result.value.project.slug} />
      <ProjectForm aggregate={result.value} availableTechnologies={technologies} />
    </div>
  );
}
