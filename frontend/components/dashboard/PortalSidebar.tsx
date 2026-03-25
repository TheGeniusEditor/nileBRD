"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronRight } from "lucide-react";

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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-gradient-to-b from-slate-50 to-white px-5 py-6 shadow-[10px_0_30px_-20px_rgba(15,23,42,0.1)]">
      <div className="mb-8 rounded-2xl gradient-primary text-white px-4 py-5 shadow-lg transform transition-transform hover:scale-105">
        <p className="text-xs uppercase tracking-[0.25em] text-blue-100 font-semibold">
          Portal Navigation
        </p>
        <h1 className="mt-2 text-base font-bold leading-tight">{title}</h1>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
        {navItems.map((item, index) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] || iconMap["layout-dashboard"];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden",
                active
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={18}
                  className={cn(
                    "transition-transform duration-200",
                    active && "group-hover:scale-110"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {active && (
                <ChevronRight
                  size={16}
                  className="transform transition-transform group-hover:translate-x-1"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="mt-6 flex items-center justify-between gap-3 rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 group"
      >
        <div className="flex items-center gap-3">
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </div>
      </Link>
    </aside>
  );
}
