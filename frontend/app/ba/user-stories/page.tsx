"use client";

import { useState } from "react";

import { AILoader } from "@/components/ui/AILoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { simulateAIGeneration } from "@/lib/aiMock";
import { backlogStories } from "@/lib/mockData";

export default function UserStoriesPage() {
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const output = await simulateAIGeneration("userStories", "Backlog for requirement lifecycle");
    setGenerated(output);
    setLoading(false);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.3fr,1fr]">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Auto-Generate User Stories</h2>
          <Button onClick={generate}>Generate Stories</Button>
        </div>
        {loading && <AILoader />}
        {generated && <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{generated}</pre>}
      </Card>
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Backlog</h3>
        <div className="space-y-2">
          {backlogStories.map((story) => (
            <div key={story.id} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs text-slate-500">{story.id}</p>
              <p className="text-sm text-slate-700">{story.story}</p>
              <div className="mt-2">
                <StatusBadge status={story.priority === "High" ? "In Progress" : "Pending"} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
