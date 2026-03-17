"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type PortalConfig } from "@/data/portalConfig";
import { cn } from "@/lib/utils";

export function PortalHeader({ portal }: { portal: PortalConfig }) {
  const { workflowStatus } = usePortal();

  return (
    <header className="fixed left-64 right-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Portal breadcrumb + stage pill */}
        <div className="flex items-center gap-3">
          <div className={cn("h-2 w-2 rounded-full", portal.colors.badgeBg, portal.colors.ring)} />
          <span className="text-sm font-semibold text-slate-700">{portal.shortTitle} Portal</span>
          <span className="text-slate-300">/</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              portal.colors.badgeBg,
              portal.colors.badgeText,
            )}
          >
            Stage: {workflowStatus}
          </span>
        </div>

        {/* Search */}
        <div className="relative w-[360px] max-w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search within portal..." className="pl-9" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                portal.colors.badgeBg,
                portal.colors.badgeText,
              )}
            >
              AR
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Arun Rao</p>
              <Badge variant="info" className="mt-0.5 text-[10px]">{portal.role}</Badge>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
