/** Shared FormData readers for admin Server Actions (server-only usage). */
export function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
export function strOrNull(fd: FormData, key: string): string | null {
  return str(fd, key) || null;
}
export function num(fd: FormData, key: string): number {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? n : 0;
}
export function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on";
}
