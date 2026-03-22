"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { baProblems } from "@/lib/mockData";

export default function AssignedProblemsPage() {
  const [rows, setRows] = useState(baProblems.map((row) => ({ ...row, assignee: row.stakeholder })));

  const assign = (id: string, assignee: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, assignee } : row)));
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Assigned Problems</h2>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[1fr,180px,120px] lg:items-center">
            <div>
              <p className="text-xs text-slate-500">{row.id}</p>
              <p className="text-sm font-medium text-slate-800">{row.title}</p>
            </div>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={row.assignee}
              onChange={(event) => assign(row.id, event.target.value)}
            >
              <option>Finance</option>
              <option>Sales Ops</option>
              <option>QA</option>
              <option>Operations</option>
            </select>
            <StatusBadge status={row.status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
