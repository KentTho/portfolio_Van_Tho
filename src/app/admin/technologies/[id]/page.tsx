import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getTechnologyUseCases } from "@/composition/technologies";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { TechnologyForm } from "../technology-form";

export const dynamic = "force-dynamic";

export default async function EditTechnologyPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const result = await getTechnologyUseCases().get.execute({ admin, id });
  if (!isOk(result)) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa công nghệ" description={result.value.slug} />
      <TechnologyForm technology={result.value} />
    </div>
  );
}
