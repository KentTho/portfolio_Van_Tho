import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { EducationForm } from "../education-form";

export const dynamic = "force-dynamic";

export default async function NewEducationPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Thêm học vấn" />
      <EducationForm />
    </div>
  );
}
