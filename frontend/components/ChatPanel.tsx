"use client";

import { FileUp, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type DiscussionMessage } from "@/data/types";

interface ChatPanelProps {
  participants: string[];
  messages: DiscussionMessage[];
  files: string[];
  notes: string[];
}

export function ChatPanel({ participants, messages, files, notes }: ChatPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Discussion Chat Panel</CardTitle>
          <p className="text-sm text-slate-500">Participants: {participants.join(", ")}</p>
        </CardHeader>
        <CardContent>
          <div className="max-h-72 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
            {messages.map((message) => (
              <div key={message.id} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{message.sender}</p>
                  <span className="text-xs text-slate-500">{message.timestamp}</span>
                </div>
                <p className="text-xs text-sky-600">{message.role}</p>
                <p className="mt-2 text-sm text-slate-700">{message.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input placeholder="Type your discussion update or requirement clarification..." />
            <Button variant="secondary" size="sm">
              <FileUp className="h-4 w-4" />
              Upload
            </Button>
            <Button size="sm">
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notes.map((note) => (
              <p key={note} className="rounded-md bg-slate-50 p-2 text-sm text-slate-700">
                {note}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.map((fileName) => (
              <p key={fileName} className="text-sm text-slate-700">
                {fileName}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
