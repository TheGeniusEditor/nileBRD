"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { iconMap } from "@/components/dashboard/IconMap";
import { type NavItem } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type SidebarProps = {
  title: string;
  navItems: NavItem[];
};

export function PortalSidebar({ title, navItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white px-4 py-6">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-4 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-100">BRM Portal</p>
        <h1 className="mt-1 text-lg font-semibold">{title}</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || iconMap["layout-dashboard"];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
