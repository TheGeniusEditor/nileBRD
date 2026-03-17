"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type UserRole } from "@/data/types";

const roles: UserRole[] = ["Stakeholder", "BA", "IT", "IT Project Manager", "Vendor", "Admin"];

export function Header() {
  const { role, setRole } = usePortal();

  return (
    <header className="fixed left-64 right-0 top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="relative w-[460px] max-w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search problems, BRDs, stories, bugs..." className="pl-9" />
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className="ml-2 border-none bg-transparent font-semibold text-slate-900 outline-none"
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button className="relative rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100">
            <Bell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-sky-100 text-center text-xs font-semibold leading-8 text-sky-700">
              AR
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Arun Rao</p>
              <Badge variant="info" className="mt-0.5">Enterprise Admin</Badge>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
}
