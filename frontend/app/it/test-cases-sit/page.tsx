"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { sitCases } from "@/lib/mockData";

export default function SITPage() {
  const [cases, setCases] = useState(sitCases);

  const update = (id: string, status: string) => {
    setCases((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Test Cases & SIT</h2>
      <div className="space-y-3">
        {cases.map((test) => (
          <div key={test.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">{test.id}</p>
                <p className="text-sm font-medium text-slate-800">{test.title}</p>
              </div>
              <StatusBadge status={test.status} />
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" onClick={() => update(test.id, "In Progress")}>
                Mark In Progress
              </Button>
              <Button onClick={() => update(test.id, "Approved")}>Mark Approved</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
