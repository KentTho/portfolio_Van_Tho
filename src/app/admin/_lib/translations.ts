import { str } from "@/app/admin/_lib/form-data";

/**
 * Build a bilingual (vi/en) translations array from flat form fields named
 * `<locale>_<field>`. A locale is included only when its required field is non-empty, so an
 * empty English section is simply omitted (vi is the required default). The resulting rows
 * are re-validated by the module's Zod schema in the use-case.
 */
export function collectTranslations(
  fd: FormData,
  requiredField: string,
  optionalFields: readonly string[],
): Array<Record<string, string | null>> {
  const out: Array<Record<string, string | null>> = [];
  for (const locale of ["vi", "en"] as const) {
    const required = str(fd, `${locale}_${requiredField}`);
    if (!required) continue;
    const row: Record<string, string | null> = { locale, [requiredField]: required };
    for (const f of optionalFields) row[f] = str(fd, `${locale}_${f}`) || null;
    out.push(row);
  }
  return out;
}
