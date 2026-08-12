import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/shared/i18n";

// Consolidated into the single landing page. Résumé content (experience &
// education) now lives at /[locale]#experience. A downloadable résumé asset is
// intentionally not rendered until a real file exists (no dead download action).
export default async function ResumeRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#experience`);
}
