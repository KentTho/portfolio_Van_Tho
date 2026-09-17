"use client";

import { useTheme } from "./theme-context";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  readonly className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      title={theme === "dark" ? "Light Mode" : "Dark Mode"}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-surface/60 text-fg-muted transition-all duration-300 hover:border-brand-primary-soft/60 hover:bg-surface-raised hover:text-brand-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      {theme === "dark" ? (
        <Sun size={17} aria-hidden className="transition-transform duration-300 group-hover:rotate-45 text-amber-400" />
      ) : (
        <Moon size={17} aria-hidden className="transition-transform duration-300 group-hover:-rotate-12 text-brand-primary" />
      )}
    </button>
  );
}
