"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/DataTable";
import { usePortal } from "@/components/PortalProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type BusinessProblem } from "@/data/types";

const columns: ColumnDef<BusinessProblem>[] = [
  { accessorKey: "id", header: "Problem ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "stakeholder", header: "Stakeholder" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="info">{row.original.status}</Badge>,
  },
  { accessorKey: "assignedBA", header: "Assigned BA" },
  { accessorKey: "createdDate", header: "Created Date" },
];

export default function BusinessProblemsPage() {
  const { problems, setProblems } = usePortal();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [priority, setPriority] = useState<BusinessProblem["priority"]>("Medium");

  const submitProblem = () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    const newProblem: BusinessProblem = {
      id: `BP-${1000 + problems.length + 1}`,
      title,
      description,
      department: department || "General",
      priority,
      stakeholder: "Current Stakeholder",
      status: "Submitted",
      assignedBA: "Unassigned",
      createdDate: new Date().toISOString().slice(0, 10),
    };

    setProblems([newProblem, ...problems]);
    setTitle("");
    setDescription("");
    setDepartment("");
    setPriority("Medium");
  };

  const assignBA = () => {
    const nextProblems = problems.map((problem) => {
      if (problem.assignedBA === "Unassigned") {
        return { ...problem, assignedBA: "Priya Sharma", status: "BA Assigned" as const };
      }
      return problem;
    });
    setProblems(nextProblems);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Step 1-2: Business Problem Submission and BA Assignment</h2>

      <Card>
        <CardHeader>
          <CardTitle>Submit Business Problem</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input placeholder="Department" value={department} onChange={(event) => setDepartment(event.target.value)} />
          <div className="md:col-span-2">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <select
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700"
            value={priority}
            onChange={(event) => setPriority(event.target.value as BusinessProblem["priority"])}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <Input placeholder="Attachments (simulate)" defaultValue="requirements-note.docx" />
          <div className="md:col-span-2 flex items-center gap-3">
            <Button onClick={submitProblem}>Submit Problem</Button>
            <Button variant="secondary" onClick={assignBA}>
              Assign BA (Admin Action)
            </Button>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={problems} />
    </div>
  );
}
