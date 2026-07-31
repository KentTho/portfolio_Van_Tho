import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/shared/i18n";

/** The root path is localized; send visitors to the default locale. */
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}
