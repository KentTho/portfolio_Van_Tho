import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { TechnologyForm } from "../technology-form";

export const dynamic = "force-dynamic";

export default async function NewTechnologyPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Thêm công nghệ" />
      <TechnologyForm />
    </div>
  );
}
