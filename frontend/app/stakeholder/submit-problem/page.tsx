"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Problem = {
  title: string;
  description: string;
  priority: string;
  attachment: string;
};

export default function SubmitProblemPage() {
  const [form, setForm] = useState<Problem>({ title: "", description: "", priority: "Medium", attachment: "" });
  const [items, setItems] = useState<Problem[]>([]);

  const submit = () => {
    if (!form.title || !form.description) return;
    setItems((prev) => [...prev, form]);
    setForm({ title: "", description: "", priority: "Medium", attachment: "" });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Submit Business Problem</h2>
        <div className="space-y-3">
          <Input
            placeholder="Problem title"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Textarea
            placeholder="Detailed description"
            rows={6}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={form.priority}
              onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <Input
              placeholder="Attachment filename (mock)"
              value={form.attachment}
              onChange={(event) => setForm((prev) => ({ ...prev, attachment: event.target.value }))}
            />
          </div>
          <Button onClick={submit}>Submit Request</Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Recent Submissions</h3>
        <div className="space-y-2">
          {items.length === 0 && <p className="text-sm text-slate-500">No local submissions yet.</p>}
          {items.map((item, idx) => (
            <div key={`${item.title}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <p className="text-xs text-slate-500">Priority: {item.priority}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
