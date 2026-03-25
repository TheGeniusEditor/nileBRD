"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-1 text-sm animate-slide-in-down"
      aria-label="breadcrumb"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
      >
        <Home size={16} className="group-hover:scale-110 transition-transform" />
        <span className="font-medium">Home</span>
      </Link>

      {parts.map((part, idx) => {
        const href = `/${parts.slice(0, idx + 1).join("/")}`;
        const label = part
          .split("-")
          .map((item) => item[0].toUpperCase() + item.slice(1))
          .join(" ");

        const isLast = idx === parts.length - 1;

        return (
          <div
            key={href}
            className="flex items-center gap-1"
            style={{ animationDelay: `${(idx + 1) * 50}ms` }}
          >
            <ChevronRight size={16} className="text-slate-300" />
            {isLast ? (
              <span className="inline-flex items-center px-3 py-1.5 text-slate-900 font-semibold bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-slate-200">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
              >
                <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                  {label}
                </span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
