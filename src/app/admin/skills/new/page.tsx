import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { SkillForm } from "../skill-form";

export const dynamic = "force-dynamic";

export default async function NewSkillPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Thêm kỹ năng" />
      <SkillForm />
    </div>
  );
}
