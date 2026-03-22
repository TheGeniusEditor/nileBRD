"use client";

import { Bell, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/ui/Input";

const notifications = [
  "2 BRD approvals pending",
  "SIT test run starts at 4 PM",
  "Deployment REL-101 marked approved",
];

export function PortalHeader({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const initials = useMemo(
    () =>
      userName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
    [userName],
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
          <Input placeholder="Search projects, requests, documents..." className="pl-9" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            >
              <Bell size={18} />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Notifications</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {notifications.map((item) => (
                    <li key={item} className="rounded-lg bg-slate-50 px-2 py-1.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {initials}
            </span>
            <div>
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-medium text-slate-800">{userName}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
