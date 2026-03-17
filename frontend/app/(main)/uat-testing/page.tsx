"use client";

import { useState } from "react";

import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scenarios = [
  "Loan application intake validation",
  "Exception routing and stakeholder notification",
  "Approval audit trail visibility",
];

export default function UATTestingPage() {
  const { setWorkflowStatus } = usePortal();
  const [results, setResults] = useState<Record<string, "Approved" | "Rejected" | "Pending">>({});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 13: UAT Testing</h2>
        <Button onClick={() => setWorkflowStatus("UAT Completed")}>Mark UAT Completed</Button>
      </div>

      <div className="grid gap-4">
        {scenarios.map((scenario) => (
          <Card key={scenario}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{scenario}</CardTitle>
              <Badge variant={results[scenario] === "Approved" ? "success" : results[scenario] === "Rejected" ? "danger" : "warning"}>
                {results[scenario] ?? "Pending"}
              </Badge>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button size="sm" variant="success" onClick={() => setResults({ ...results, [scenario]: "Approved" })}>
                Approve
              </Button>
              <Button size="sm" variant="warning" onClick={() => setResults({ ...results, [scenario]: "Rejected" })}>
                Reject
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
