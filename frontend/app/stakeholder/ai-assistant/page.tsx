"use client";

import { useState } from "react";

import { AILoader } from "@/components/ui/AILoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { simulateAIGeneration } from "@/lib/aiMock";

export default function StakeholderAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const response = await simulateAIGeneration("assistant", prompt);
    setAnswer(response);
    setLoading(false);
  };

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">AI Assistant</h2>
      <div className="mb-3 flex gap-2">
        <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask anything about your project" />
        <Button onClick={ask}>Ask</Button>
      </div>
      {loading && <AILoader />}
      {answer && <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{answer}</pre>}
    </Card>
  );
}
