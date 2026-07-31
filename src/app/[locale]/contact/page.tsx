import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/shared/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { buildLocaleMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/public/page-header";
import { ContactForm } from "@/components/public/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildLocaleMetadata({
    locale,
    path: "/contact",
    title: dict.meta.contactTitle,
    description: dict.contact.subtitle,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <PageHeader eyebrow="Contact" title={dict.contact.title} subtitle={dict.contact.subtitle} />
      <ContactForm dict={dict} />
    </div>
  );
}
