"use client";

import { Bell, Search, X } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-lg shadow-sm animate-slide-in-down">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-3 text-slate-400" size={18} />
          <Input
            placeholder="Search projects, requests, documents..."
            className="pl-11 transition-all focus:shadow-md"
            variant="subtle"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 hover-lift"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            </button>
            {open && (
              <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-scale-in origin-top-right">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold uppercase text-slate-700 tracking-wide">
                    Notifications
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((item, idx) => (
                    <div
                      key={item}
                      className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 px-3 py-2.5 text-sm text-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer hover-scale animate-slide-in-left"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <p className="font-medium text-slate-800">{item}</p>
                      <p className="text-xs text-slate-500 mt-1">Just now</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-3 py-2 hover:shadow-md transition-all duration-200 hover-lift">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white shadow-md">
              {initials}
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Signed in as</p>
              <p className="text-sm font-bold text-slate-900">{userName}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
