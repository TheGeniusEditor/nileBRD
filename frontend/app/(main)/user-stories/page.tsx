"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Story } from "@/data/types";

const columns: ColumnDef<Story>[] = [
  { accessorKey: "id", header: "Story ID" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "sprint", header: "Sprint" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="info">{row.original.status}</Badge>,
  },
];

export default function UserStoriesPage() {
  const { stories, setWorkflowStatus } = usePortal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 10: AI User Story Generation</h2>
        <Button onClick={() => setWorkflowStatus("User Stories Approved")}>Approve User Stories</Button>
      </div>

      <p className="rounded-lg bg-sky-50 p-3 text-sm text-slate-700">
        AI generated backlog from FRD sections and discussion transcripts. Stakeholders can review and approve.
      </p>

      <DataTable columns={columns} data={stories} />
    </div>
  );
}
