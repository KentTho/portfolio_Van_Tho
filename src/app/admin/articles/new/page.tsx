import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { ArticleForm } from "../article-form";
import { loadTagOptions } from "../_load-tags";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const admin = await getAdminOrRedirect();
  const tags = await loadTagOptions(admin);
  return (
    <div>
      <AdminPageHeader title="Viết bài" />
      <ArticleForm availableTags={tags} />
    </div>
  );
}
