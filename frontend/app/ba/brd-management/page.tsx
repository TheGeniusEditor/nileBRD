"use client";

import { useState } from "react";

import { AILoader } from "@/components/ui/AILoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { simulateAIGeneration } from "@/lib/aiMock";
import { versionHistory } from "@/lib/mockData";

export default function BRDManagementPage() {
  const [doc, setDoc] = useState("Click generate to create a BRD draft.");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const output = await simulateAIGeneration("brd", "Payment reconciliation initiative");
    setDoc(output);
    setLoading(false);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr,1fr]">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">BRD Management</h2>
          <Button onClick={generate}>Generate BRD</Button>
        </div>
        {loading && <AILoader />}
        <Textarea rows={16} value={doc} onChange={(event) => setDoc(event.target.value)} className="mt-3 font-mono text-xs" />
      </Card>
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Version History</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {versionHistory.map((version) => (
            <li key={version.version} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="font-medium text-slate-800">{version.version}</p>
              <p>{version.note}</p>
              <p className="text-xs text-slate-500">{version.author}</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
