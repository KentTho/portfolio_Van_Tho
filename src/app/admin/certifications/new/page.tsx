import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { CertificationForm } from "../certification-form";

export const dynamic = "force-dynamic";

export default async function NewCertificationPage() {
  await getAdminOrRedirect();
  return (
    <div>
      <AdminPageHeader title="Thêm chứng chỉ" />
      <CertificationForm />
    </div>
  );
}
