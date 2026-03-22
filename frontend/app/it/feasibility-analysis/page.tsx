"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { feasibilityRows } from "@/lib/mockData";

export default function FeasibilityPage() {
  const [notes, setNotes] = useState("Technical feasibility is medium. Integrations need throttling strategy.");

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Feasibility Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2">Item</th>
                <th className="px-2 py-2">Estimate</th>
                <th className="px-2 py-2">Feasibility</th>
                <th className="px-2 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {feasibilityRows.map((row) => (
                <tr key={row.item} className="border-b border-slate-100 text-slate-700">
                  <td className="px-2 py-3">{row.item}</td>
                  <td className="px-2 py-3">{row.estimate}</td>
                  <td className="px-2 py-3">{row.feasibility}</td>
                  <td className="px-2 py-3">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Technical Feasibility Notes</h3>
        <Textarea rows={7} value={notes} onChange={(event) => setNotes(event.target.value)} />
        <Button className="mt-3">Save Notes</Button>
      </Card>
    </div>
  );
}
