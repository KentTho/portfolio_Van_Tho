import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { ProjectForm } from "../project-form";
import { loadTechOptions } from "../_load-tech";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const admin = await getAdminOrRedirect();
  const technologies = await loadTechOptions(admin);
  return (
    <div>
      <AdminPageHeader title="Tạo dự án" />
      <ProjectForm availableTechnologies={technologies} />
    </div>
  );
}
