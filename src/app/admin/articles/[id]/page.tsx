import { notFound } from "next/navigation";
import { isOk } from "@/shared/domain/result";
import { getAdminOrRedirect } from "@/app/admin/_lib/session";
import { getArticleAdminUseCases } from "@/composition/articles";
import { AdminPageHeader } from "@/app/admin/_components/page-parts";
import { ArticleForm } from "../article-form";
import { loadTagOptions } from "../_load-tags";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminOrRedirect();
  const { id } = await params;
  const [result, tags] = await Promise.all([
    getArticleAdminUseCases().get.execute({ admin, id }),
    loadTagOptions(admin),
  ]);
  if (!isOk(result)) notFound();

  return (
    <div>
      <AdminPageHeader title="Sửa bài viết" description={result.value.article.slug} />
      <ArticleForm aggregate={result.value} availableTags={tags} />
    </div>
  );
}
