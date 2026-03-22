"use client";

import { useState } from "react";

import { AILoader } from "@/components/ui/AILoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { simulateAIGeneration, type AIContentType } from "@/lib/aiMock";

const tools: { label: string; type: AIContentType }[] = [
  { label: "Generate BRD", type: "brd" },
  { label: "Generate FRD", type: "frd" },
  { label: "Generate User Stories", type: "userStories" },
  { label: "Generate Test Cases", type: "testCases" },
];

export default function AIToolsPage() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const runTool = async (type: AIContentType) => {
    setLoading(true);
    const result = await simulateAIGeneration(type, "Generated from BA toolset");
    setOutput(result);
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">AI Generator Tools</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Button key={tool.label} variant="secondary" onClick={() => runTool(tool.type)}>
            {tool.label}
          </Button>
        ))}
      </div>
      {loading && <AILoader />}
      {output && <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{output}</pre>}
    </Card>
  );
}
