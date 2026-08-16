import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getTagUseCases } from "@/composition/tags";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { TagForm } from "../tag-form";

export const dynamic = "force-dynamic";

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const result = await getTagUseCases().get.execute({ admin, id });
  if (!isOk(result)) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa thẻ" description={result.value.slug} />
      <TagForm tag={result.value} />
    </div>
  );
}
