import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getSkillAdminUseCases } from "@/composition/skills";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { SkillForm } from "../skill-form";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const result = await getSkillAdminUseCases().get.execute({ admin, id });
  if (!isOk(result)) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa kỹ năng" description={result.value.slug} />
      <SkillForm skill={result.value} />
    </div>
  );
}
