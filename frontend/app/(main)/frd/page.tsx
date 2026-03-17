"use client";

import { useState } from "react";

import { usePortal } from "@/components/PortalProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockFRDSections } from "@/data/mockFRDs";

export default function FRDPage() {
  const { setWorkflowStatus } = usePortal();
  const [developmentType, setDevelopmentType] = useState<"Internal" | "External Vendor">("Internal");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Step 7-9: Feasibility, Development Assignment, and FRD Creation</h2>

      <Card>
        <CardHeader>
          <CardTitle>IT Feasibility Analysis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Technical feasibility: Existing API landscape supports modular workflow orchestration.</p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Architecture notes: Introduce event bus for async approvals and audit trail reliability.</p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Cost estimation: 4 squads over 3 sprints plus hardening sprint.</p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Technology stack: Next.js portal, Node APIs, PostgreSQL, Kafka integration.</p>
          <Button className="md:col-span-2" onClick={() => setWorkflowStatus("IT Feasibility Completed")}>
            Mark IT Feasibility Completed
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="text-sm text-slate-600">Development Type</label>
          <select
            value={developmentType}
            onChange={(event) => setDevelopmentType(event.target.value as "Internal" | "External Vendor")}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="Internal">Internal</option>
            <option value="External Vendor">External Vendor</option>
          </select>
          <Button variant="secondary" onClick={() => setWorkflowStatus("Development Assigned")}>
            Assign Development Team
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FRD Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {developmentType === "Internal" ? (
            <>
              <p className="rounded-lg bg-sky-50 p-3 text-sm text-slate-700">
                AI FRD generation simulated from approved BRD and feasibility notes.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {mockFRDSections.map((section) => (
                  <div key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                    <p className="mt-2 text-sm text-slate-700">{section.content}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
              Vendor portal upload area: drop FRD package or browse files for outsourced delivery.
            </div>
          )}
          <Button variant="success" onClick={() => setWorkflowStatus("FRD Draft Created")}>
            Set Status: FRD Draft Created
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
