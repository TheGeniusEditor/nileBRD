"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const cannedResponses: Record<string, string> = {
  "show brd summary for project x": "Project X BRD summary: scope finalized, risk matrix approved, timeline 12 weeks, budget USD 280k.",
  "what bugs are open": "Open bugs: BUG-701 (High, Workflow Squad), BUG-702 (Medium, API Squad).",
  "what is the deployment status": "Current deployment status: DEP-902 validated in testing, DEP-903 planned for production rollout.",
};

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: "User" | "Assistant"; text: string }[]>([]);

  const ask = () => {
    if (!prompt.trim()) {
      return;
    }

    const normalized = prompt.trim().toLowerCase();
    const answer = cannedResponses[normalized] ?? "I can help with BRD summaries, bug status, and deployment updates using mock project data.";

    setMessages((prev) => [...prev, { role: "User", text: prompt }, { role: "Assistant", text: answer }]);
    setPrompt("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">AI Knowledge Assistant</h2>

      <Card>
        <CardHeader>
          <CardTitle>Ask Portal Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500">Try: &quot;Show BRD summary for project X&quot;</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    message.role === "User"
                      ? "ml-auto bg-sky-100 text-slate-800"
                      : "bg-white text-slate-700"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider">{message.role}</p>
                  <p className="mt-1">{message.text}</p>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ask about BRD, bugs, or deployment status..." />
            <Button onClick={ask}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
