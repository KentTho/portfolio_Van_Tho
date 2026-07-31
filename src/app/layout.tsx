import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { SkipLink } from "@/components/accessibility/skip-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.name,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={SITE.defaultLocale} className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-canvas text-fg">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
