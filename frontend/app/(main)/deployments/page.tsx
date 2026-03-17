"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Deployment } from "@/data/types";

const columns: ColumnDef<Deployment>[] = [
  { accessorKey: "id", header: "Deployment ID" },
  { accessorKey: "milestone", header: "Milestone" },
  { accessorKey: "environment", header: "Environment" },
  { accessorKey: "releaseDate", header: "Release Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="info">{row.original.status}</Badge>,
  },
];

export default function DeploymentsPage() {
  const { deployments, setWorkflowStatus } = usePortal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 15: Deployment Tracking</h2>
        <Button onClick={() => setWorkflowStatus("Production Deployment")}>Set Status: Production Deployment</Button>
      </div>

      <DataTable columns={columns} data={deployments} />

      <Card>
        <CardHeader>
          <CardTitle>Deployment Stages</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Development: Build complete and integration checks passed.</p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Testing: SIT and UAT gates aligned to release checklist.</p>
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">Production: Change window approved for controlled rollout.</p>
        </CardContent>
      </Card>
    </div>
  );
}
