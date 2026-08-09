import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { TagForm } from "../tag-form";

export const dynamic = "force-dynamic";

export default async function NewTagPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Thêm thẻ" />
      <TagForm />
    </div>
  );
}
