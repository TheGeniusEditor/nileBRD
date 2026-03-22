"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type ChatMessage = {
  from: string;
  text: string;
  at: string;
};

export function ChatPanel({
  initialMessages,
  placeholder = "Type your message...",
}: {
  initialMessages: ChatMessage[];
  placeholder?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "You", text: draft, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setDraft("");
  };

  return (
    <Card className="flex h-[520px] flex-col">
      <h3 className="mb-3 text-base font-semibold text-slate-800">Discussion Thread</h3>
      <div className="mb-4 flex-1 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div key={`${message.at}-${index}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs font-semibold text-slate-500">{message.from}</p>
            <p className="text-sm text-slate-700">{message.text}</p>
            <p className="text-[11px] text-slate-400">{message.at}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholder} />
        <Button onClick={send}>Send</Button>
      </div>
    </Card>
  );
}
