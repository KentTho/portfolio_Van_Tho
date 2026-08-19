/**
 * Pure Copy-email state helpers (no React) so the button labels + accessible
 * announcements are unit-testable. The interactive clipboard write lives in the
 * component; these map a state to its visible label and its aria-live text.
 */
export type CopyState = "idle" | "copied" | "error";

export function copyLabel(
  state: CopyState,
  t: { readonly copyEmail: string; readonly copied: string; readonly copyError: string },
): string {
  if (state === "copied") return t.copied;
  if (state === "error") return t.copyError;
  return t.copyEmail;
}

export function copyAnnounce(
  state: CopyState,
  t: { readonly copiedAnnounce: string; readonly copyErrorAnnounce: string },
): string {
  if (state === "copied") return t.copiedAnnounce;
  if (state === "error") return t.copyErrorAnnounce;
  return "";
}
