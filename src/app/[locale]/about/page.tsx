import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/shared/i18n";

// Consolidated into the single landing page. /[locale]/about now lives at
// /[locale]#about. Project/article detail routes are the only non-landing
// public routes that remain.
export default async function AboutRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#about`);
}
