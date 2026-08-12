import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/shared/i18n";

// Consolidated into the single landing page. The former article list now lives
// at /[locale]#articles. Article detail routes (/[locale]/articles/[slug]) remain.
export default async function ArticlesRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#articles`);
}
