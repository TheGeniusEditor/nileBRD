"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { WorkflowStatus } from "@/components/WorkflowStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBRDSections } from "@/data/mockBRDs";
import { type BRDVersion } from "@/data/types";

const versionColumns: ColumnDef<BRDVersion>[] = [
  { accessorKey: "version", header: "Version" },
  { accessorKey: "label", header: "Label" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "Approved" ? "success" : status === "Under Review" ? "warning" : "default";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  { accessorKey: "updatedBy", header: "Updated By" },
  { accessorKey: "updatedAt", header: "Updated At" },
];

export default function BRDPage() {
  const { workflowStatus, setWorkflowStatus, progressWorkflow, brdVersions } = usePortal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 4-6: AI BRD Generation, Versioning, and Stakeholder Review</h2>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setWorkflowStatus("BRD Draft Generated")}>
            Generate BRD Draft
          </Button>
          <Button variant="success" onClick={() => setWorkflowStatus("BRD Approved")}>
            Approve BRD
          </Button>
        </div>
      </div>

      <WorkflowStatus currentStatus={workflowStatus} onNextStep={progressWorkflow} title="Portal Lifecycle Status" />

      <Card>
        <CardHeader>
          <CardTitle>AI Generated BRD Sections</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {mockBRDSections.map((section) => (
            <div key={section.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{section.title}</p>
              <p className="mt-2 text-sm text-slate-700">{section.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholder Review Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline">Comment</Button>
          <Button variant="warning">Request Changes</Button>
          <Button variant="success">Approve BRD</Button>
          <Button variant="secondary">Save New Version</Button>
          <Button variant="secondary">Share with Stakeholders</Button>
        </CardContent>
      </Card>

      <DataTable columns={versionColumns} data={brdVersions} />
    </div>
  );
}
