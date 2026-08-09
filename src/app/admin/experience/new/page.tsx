import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { ExperienceForm } from "../experience-form";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Thêm kinh nghiệm" />
      <ExperienceForm />
    </div>
  );
}
