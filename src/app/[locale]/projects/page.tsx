import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/shared/i18n";

// Consolidated into the single landing page. The former project list now lives
// at /[locale]#projects. Project detail routes (/[locale]/projects/[slug]) remain.
export default async function ProjectsRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#projects`);
}
