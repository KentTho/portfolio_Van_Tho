import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/shared/i18n";

// Consolidated into the single landing page. Contact now lives at
// /[locale]#contact, exposing real contact methods (email + social links).
// The contact write boundary (form + Turnstile + delivery) is Wave 06A.
export default async function ContactRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}#contact`);
}
