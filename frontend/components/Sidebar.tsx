"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Briefcase,
  Bug,
  ClipboardList,
  Code2,
  FileCheck,
  FileCode2,
  FileText,
  FlaskConical,
  Home,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  ShieldCheck,
  TestTube2,
  Truck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const portalItems = [
  { href: "/",                   label: "Home",                icon: Home,          dot: null },
  { href: "/portal/stakeholder", label: "Stakeholder Portal",  icon: Users,         dot: "bg-violet-400" },
  { href: "/portal/ba",          label: "BA Portal",           icon: Briefcase,     dot: "bg-sky-400" },
  { href: "/portal/it",          label: "IT Portal",           icon: Code2,         dot: "bg-emerald-400" },
  { href: "/portal/it-pm",       label: "IT PM Portal",        icon: LayoutDashboard, dot: "bg-amber-400" },
  { href: "/portal/vendor",      label: "Vendor Portal",       icon: Truck,         dot: "bg-rose-400" },
  { href: "/portal/admin",       label: "Admin Portal",        icon: ShieldCheck,   dot: "bg-slate-400" },
];

const moduleItems = [
  { href: "/dashboard",          label: "Dashboard",           icon: LayoutDashboard },
  { href: "/business-problems",  label: "Business Problems",   icon: ClipboardList },
  { href: "/discussions",        label: "Discussions",         icon: MessageSquare },
  { href: "/brd",                label: "BRD Management",      icon: FileText },
  { href: "/frd",                label: "FRD Management",      icon: FileCode2 },
  { href: "/user-stories",       label: "User Stories",        icon: Users },
  { href: "/test-cases",         label: "Test Cases",          icon: TestTube2 },
  { href: "/sit-testing",        label: "SIT Testing",         icon: FlaskConical },
  { href: "/uat-testing",        label: "UAT Testing",         icon: ShieldCheck },
  { href: "/bugs",               label: "Bug Tracking",        icon: Bug },
  { href: "/deployments",        label: "Deployment Tracking", icon: Rocket },
  { href: "/ai-assistant",       label: "AI Assistant",        icon: Bot },
  { href: "/admin",              label: "Admin Panel",         icon: FileCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur">
      {/* Logo */}
      <div className="shrink-0 border-b border-slate-200 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Enterprise</p>
        <h1 className="mt-1 text-lg font-semibold text-slate-900">AI BRM Portal</h1>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto p-3 pb-6">
        {/* — Portals section — */}
        <p className="mb-1 mt-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Portals
        </p>
        <div className="space-y-0.5">
          {portalItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sky-100 font-medium text-sky-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {item.dot ? (
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", item.dot)} />
                ) : (
                  <Icon className="h-4 w-4 shrink-0" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* — Divider — */}
        <div className="my-3 border-t border-slate-200" />

        {/* — Modules section — */}
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Modules
        </p>
        <div className="space-y-0.5">
          {moduleItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-sky-100 font-medium text-sky-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
