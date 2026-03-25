"use client";

import { useState } from "react";
import { Send, Video } from "lucide-react";

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
      {
        from: "You",
        text: draft,
        at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setDraft("");
  };

  const startTeamsMeeting = () => {
    window.open("https://teams.microsoft.com/l/meeting/new", "_blank", "noopener,noreferrer");
  };

  const isYourMessage = (message: ChatMessage) => message.from === "You";

  return (
    <Card variant="elevated" className="flex h-[520px] flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 mb-4">
        <h3 className="text-lg font-bold text-slate-900">Discussion Thread</h3>
        <p className="text-xs text-slate-500 mt-1">
          {messages.length} messages
        </p>
      </div>

      {/* Messages Container */}
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto pr-2">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={`${message.at}-${index}`}
              className={`flex animate-slide-in-up ${
                isYourMessage(message) ? "justify-end" : "justify-start"
              }`}
              style={{
                animationDelay: `${(index % 5) * 50}ms`,
              }}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow ${
                  isYourMessage(message)
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                    : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900 border border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p
                    className={`text-xs font-semibold ${
                      isYourMessage(message)
                        ? "text-blue-100"
                        : "text-slate-600"
                    }`}
                  >
                    {message.from}
                  </p>
                  <p
                    className={`text-[10px] ${
                      isYourMessage(message)
                        ? "text-blue-200"
                        : "text-slate-400"
                    }`}
                  >
                    {message.at}
                  </p>
                </div>
                <p className={`text-sm leading-relaxed`}>
                  {message.text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyPress={(e) => e.key === "Enter" && send()}
            placeholder={placeholder}
            variant="subtle"
            className="flex-1"
          />
          <Button
            onClick={send}
            size="md"
            variant="gradient-primary"
            className="inline-flex items-center gap-2"
          >
            <Send size={16} />
            Send
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={startTeamsMeeting}
          className="w-full inline-flex items-center justify-center gap-2"
        >
          <Video size={16} />
          Start Teams Meeting
        </Button>
      </div>
    </Card>
  );
}
