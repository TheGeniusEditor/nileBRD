"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  Bug,
  ClipboardList,
  FileCode2,
  FileText,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  ShieldCheck,
  TestTube2,
  Users,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

import { type PortalConfig } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const portalNav: Record<string, NavItem[]> = {
  stakeholder: [
    { href: "/business-problems", label: "Submit Problems",       Icon: ClipboardList },
    { href: "/discussions",        label: "Discussions",          Icon: MessageSquare },
    { href: "/brd",                label: "BRD Review & Approval",Icon: FileText },
    { href: "/user-stories",       label: "User Stories",         Icon: Users },
    { href: "/uat-testing",        label: "UAT Sign-Off",         Icon: ShieldCheck },
  ],
  ba: [
    { href: "/business-problems", label: "Problem Queue",         Icon: ClipboardList },
    { href: "/discussions",        label: "Req. Gathering",       Icon: MessageSquare },
    { href: "/brd",                label: "BRD Management",       Icon: FileText },
    { href: "/frd",                label: "FRD Coordination",     Icon: FileCode2 },
  ],
  it: [
    { href: "/frd",                label: "FRD & Feasibility",    Icon: FileCode2 },
    { href: "/test-cases",         label: "Test Cases",           Icon: TestTube2 },
    { href: "/sit-testing",        label: "SIT Execution",        Icon: FlaskConical },
    { href: "/bugs",               label: "Bug Tracking",         Icon: Bug },
  ],
  "it-pm": [
    { href: "/frd",                label: "Dev Assignment",       Icon: FileCode2 },
    { href: "/user-stories",       label: "Sprint Governance",    Icon: Users },
    { href: "/deployments",        label: "Deployments",          Icon: Rocket },
    { href: "/bugs",               label: "Bug Escalations",      Icon: Bug },
    { href: "/dashboard",          label: "Analytics",            Icon: LayoutDashboard },
  ],
  vendor: [
    { href: "/frd",                label: "FRD Upload",           Icon: FileCode2 },
    { href: "/bugs",               label: "Bug Coordination",     Icon: Bug },
    { href: "/deployments",        label: "Release Readiness",    Icon: Rocket },
  ],
  admin: [
    { href: "/business-problems", label: "All Problems",          Icon: ClipboardList },
    { href: "/brd",                label: "BRD Oversight",        Icon: FileText },
    { href: "/frd",                label: "FRD Oversight",        Icon: FileCode2 },
    { href: "/sit-testing",        label: "SIT Status",           Icon: FlaskConical },
    { href: "/bugs",               label: "Bug Governance",       Icon: Bug },
    { href: "/deployments",        label: "Deployments",          Icon: Rocket },
    { href: "/dashboard",          label: "Full Analytics",       Icon: LayoutDashboard },
    { href: "/admin",              label: "System Monitoring",    Icon: ShieldCheck },
    { href: "/ai-assistant",       label: "AI Assistant",         Icon: Bot },
  ],
};

export function PortalSidebar({ portal }: { portal: PortalConfig }) {
  const pathname = usePathname();
  const items = portalNav[portal.slug] ?? [];

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur">
      {/* Portal branding */}
      <div className={cn("shrink-0 border-b px-5 py-4", portal.colors.border, portal.colors.bg)}>
        <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", portal.colors.text)}>
          Role Portal
        </p>
        <h1 className="mt-1 text-base font-bold text-slate-900">{portal.title}</h1>
        <span
          className={cn(
            "mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            portal.colors.badgeBg,
            portal.colors.badgeText,
          )}
        >
          {portal.role}
        </span>
      </div>

      {/* Dashboard link */}
      <div className="shrink-0 px-3 pt-3">
        <Link
          href={`/portal/${portal.slug}`}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === `/portal/${portal.slug}`
              ? cn(portal.colors.bg, portal.colors.text)
              : "text-slate-600 hover:bg-slate-100",
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          My Dashboard
        </Link>
      </div>

      {/* Divider + module nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="mb-1 mt-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          My Modules
        </p>
        <div className="space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? cn(portal.colors.bg, portal.colors.text, "font-medium")
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                <item.Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Back to home */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Portal Home
        </Link>
      </div>
    </aside>
  );
}
