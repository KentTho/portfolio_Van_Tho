export interface NavItem {
  readonly label: string;
  readonly href: string;
}

/**
 * Primary navigation. Kept to routes that actually exist in the Wave 02
 * foundation (no dead links). Public content routes are added in Wave 04.
 */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Admin", href: "/admin" },
] as const;
