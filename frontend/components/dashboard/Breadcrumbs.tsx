"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/" className="hover:text-slate-700">
        Home
      </Link>
      {parts.map((part, idx) => {
        const href = `/${parts.slice(0, idx + 1).join("/")}`;
        const label = part
          .split("-")
          .map((item) => item[0].toUpperCase() + item.slice(1))
          .join(" ");
        return (
          <span key={href} className="flex items-center gap-2">
            <span>/</span>
            <Link href={href} className="hover:text-slate-700">
              {label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
