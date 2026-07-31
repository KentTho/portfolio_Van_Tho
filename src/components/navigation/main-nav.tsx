import Link from "next/link";
import { PRIMARY_NAV } from "@/config/navigation";

export function MainNav() {
  return (
    <nav aria-label="Primary" className="flex items-center gap-6">
      {PRIMARY_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-sm text-sm text-fg-muted transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
