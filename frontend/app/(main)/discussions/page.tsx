"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { usePortal } from "@/components/PortalProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDiscussionFiles, mockDiscussions, mockMeetingNotes } from "@/data/mockDiscussions";

export default function DiscussionsPage() {
  const { setWorkflowStatus } = usePortal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Step 3: Stakeholder Discussions</h2>
        <Button onClick={() => setWorkflowStatus("Requirement Gathering")}>Set Status: Requirement Gathering</Button>
      </div>

      <ChatPanel
        participants={["Anita Rao", "Priya Sharma", "Arvind Kumar", "Rahul Menon"]}
        messages={mockDiscussions}
        files={mockDiscussionFiles}
        notes={mockMeetingNotes}
      />

      <Card>
        <CardHeader>
          <CardTitle>Discussion Timeline and Transcript Capture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p className="rounded-lg bg-slate-50 p-3">09:00 - Kickoff meeting initiated and scope reviewed.</p>
          <p className="rounded-lg bg-slate-50 p-3">09:18 - Functional gaps documented with expected impact matrix.</p>
          <p className="rounded-lg bg-slate-50 p-3">09:40 - Transcript captured and linked for AI BRD generation.</p>
        </CardContent>
      </Card>
    </div>
  );
}
