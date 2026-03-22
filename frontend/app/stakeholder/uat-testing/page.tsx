"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { uatCases } from "@/lib/mockData";

export default function UATTestingPage() {
  const [cases, setCases] = useState(uatCases);
  const [feedback, setFeedback] = useState("");

  const setResult = (id: string, result: string) => {
    setCases((prev) => prev.map((item) => (item.id === id ? { ...item, result } : item)));
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">UAT Testing</h2>
      <div className="space-y-3">
        {cases.map((test) => (
          <div key={test.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">{test.id}</p>
                <p className="text-sm font-medium text-slate-800">{test.testCase}</p>
              </div>
              <StatusBadge status={test.result} />
            </div>
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" onClick={() => setResult(test.id, "Pass")}>
                Mark Pass
              </Button>
              <Button variant="danger" onClick={() => setResult(test.id, "Fail")}>
                Mark Fail
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Input
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Submit feedback summary"
        />
        <Button>Submit Feedback</Button>
      </div>
    </Card>
  );
}
