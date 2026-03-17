"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type TestCase } from "@/data/types";

const columns: ColumnDef<TestCase>[] = [
  { accessorKey: "id", header: "Test Case ID" },
  { accessorKey: "storyRef", header: "Story Reference" },
  { accessorKey: "steps", header: "Test Steps" },
  { accessorKey: "expectedResult", header: "Expected Result" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "Pass" ? "success" : status === "Fail" ? "danger" : "warning";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
];

export default function TestCasesPage() {
  const { testCases, setWorkflowStatus } = usePortal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 11: AI Test Case Generation</h2>
        <Button onClick={() => setWorkflowStatus("Test Cases Generated")}>Set Status: Test Cases Generated</Button>
      </div>

      <DataTable columns={columns} data={testCases} />
    </div>
  );
}
