"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./request.module.css";
import {
  ConversationThread,
  StakeholderRequest,
  getRequests,
  saveRequests,
} from "@/lib/workflow";

const NOTES_KEY_PREFIX = "baConversationNotes";
const avatarColors = ["#ec4899", "#10b981", "#f59e0b", "#2563eb", "#8b5cf6", "#ef4444"];

const getInitials = (participants?: string) => {
  if (!participants) {
    return "BA";
  }

  const clean = participants
    .split(/[,/&]/)
    .join(" ")
    .trim();

  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "BA";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getThreadTime = (thread: ConversationThread) => {
  if (thread.time) {
    return thread.time;
  }

  if (!thread.date) {
    return "";
  }

  const parsed = new Date(thread.date);
  if (Number.isNaN(parsed.getTime())) {
    return thread.date;
  }

  return parsed.toLocaleDateString();
};

const buildMockConversations = (request: StakeholderRequest): ConversationThread[] => [
  {
    id: `${request.id}-mock-1`,
    title: "Initial stakeholder ask",
    date: request.createdAt,
    participants: request.owner || "Stakeholder Team",
    notes: request.brief || "Need BA support for BRD drafting.",
  },
  {
    id: `${request.id}-mock-2`,
    title: "BA clarification",
    date: request.createdAt,
    participants: "BA Team",
    notes: "Reviewed request. BRD drafting can start once conversation points are finalized.",
  },
  {
    id: `${request.id}-mock-3`,
    title: "Scope alignment",
    date: request.createdAt,
    participants: "Stakeholder, BA, Risk",
    notes: "Aligned phase-1 boundaries and captured major non-goals for later releases.",
  },
];

const buildConversationPointList = (content: string): string[] => {
  const deduped = new Set<string>();

  const lines = content
    .split(/\n+|(?<=[.!?])\s+/)
    .map((item) => item.replace(/^[\-•\d.\s]+/, "").trim())
    .filter((item) => item.length >= 20);

  for (const line of lines) {
    const normalized = line.toLowerCase();
    if (!deduped.has(normalized)) {
      deduped.add(normalized);
    }

    if (deduped.size >= 10) {
      break;
    }
  }

  return Array.from(deduped).map((line) => line[0].toUpperCase() + line.slice(1));
};

export default function RequestWorkspacePage() {
  const params = useParams<{ id: string }>();
  const requestId = params?.id;

  const [request, setRequest] = useState<StakeholderRequest | null>(null);
  const [conversationPoints, setConversationPoints] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [searchText, setSearchText] = useState("");
  const [reply, setReply] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (!requestId) {
      return;
    }

    const all = getRequests();
    const found = all.find((item) => item.id === requestId) || null;
    setRequest(found);

    if (found && typeof window !== "undefined") {
      const savedNotes = window.localStorage.getItem(`${NOTES_KEY_PREFIX}:${found.id}`) || "";
      setConversationPoints(savedNotes);
      setSavedAt("");
    }
  }, [requestId]);

  const persistRequest = (updater: (item: StakeholderRequest) => StakeholderRequest) => {
    if (!request) {
      return;
    }

    const all = getRequests();
    const next = all.map((item) => {
      if (item.id !== request.id) {
        return item;
      }

      return updater(item);
    });

    saveRequests(next);

    const refreshed = next.find((item) => item.id === request.id) || null;
    setRequest(refreshed);
  };

  const saveConversationPoints = () => {
    if (!request || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(`${NOTES_KEY_PREFIX}:${request.id}`, conversationPoints.trim());
    setSavedAt(new Date().toLocaleTimeString());
  };

  const sendReply = () => {
    if (!request || !reply.trim()) {
      return;
    }

    const text = reply.trim();
    persistRequest((item) => ({
      ...item,
      status: item.status === "approved" ? "approved" : "in_progress",
      threads: [
        ...(item.threads || []),
        {
          id: `${item.id}-msg-${Date.now()}`,
          title: "BA Follow-up",
          date: new Date().toLocaleString(),
          participants: "BA Team",
          notes: text,
        },
      ],
    }));

    setReply("");
  };

  const initiateTeamsMeeting = () => {
    if (!request) {
      return;
    }

    const subject = encodeURIComponent(`BRD working session: ${request.reqTitle}`);
    const content = encodeURIComponent(
      `Discussion context: ${request.reqType} (${request.priority}) for ${request.tenant}`
    );

    window.open(
      `https://teams.microsoft.com/l/meeting/new?subject=${subject}&content=${content}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const summaryItems = useMemo(() => {
    if (!request) {
      return [] as Array<{ label: string; value: string }>;
    }

    const items: Array<{ label: string; value: string }> = [
      { label: "Request Created", value: request.createdAt },
      { label: "Current Status", value: request.status.replace("_", " ") },
      { label: "Owner", value: request.owner || "Unassigned" },
      { label: "Tenant", value: request.tenant },
    ];

    if (request.aiGeneratedAt) {
      items.push({ label: "AI Generated", value: request.aiGeneratedAt });
    }

    return items;
  }, [request]);

  const chatThreads = useMemo(() => {
    if (!request) {
      return [] as ConversationThread[];
    }

    if ((request.threads || []).length > 0) {
      return request.threads;
    }

    return buildMockConversations(request);
  }, [request]);

  const filteredThreads = useMemo(() => {
    if (!searchText.trim()) {
      return chatThreads;
    }

    const query = searchText.toLowerCase();
    return chatThreads.filter((thread) => {
      const target = `${thread.title} ${thread.notes} ${thread.transcript} ${thread.participants}`.toLowerCase();
      return target.includes(query);
    });
  }, [chatThreads, searchText]);

  const summarizeToConversationPoints = async () => {
    const content = chatThreads
      .map((thread) => `${thread.title}. ${thread.notes || ""}. ${thread.transcript || ""}`)
      .join("\n");

    if (!content.trim()) {
      return;
    }

    setIsSummarizing(true);
    await new Promise((resolve) => setTimeout(resolve, 650));

    const points = buildConversationPointList(content);
    const formatted = points.map((point) => `• ${point}`).join("\n");
    setConversationPoints((prev) => {
      if (!prev.trim()) {
        return formatted;
      }

      return `${prev.trim()}\n\n${formatted}`;
    });
    setSavedAt("");
    setIsSummarizing(false);
  };

  if (!request) {
    return (
      <div className={styles.notFoundWrap}>
        <div className={styles.notFoundCard}>
          <h1>Request not found</h1>
          <p>This stakeholder request was not found in local data.</p>
          <Link href="/ba-portal/requests" className={styles.backBtn}>
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <Link href="/ba-portal/requests" className={styles.backLink}>
            ← Back to Requests
          </Link>
          <h1>{request.reqTitle}</h1>
          <p>{request.reqType} • {request.priority} • {request.tenant}</p>
        </div>
      </header>

      <div className={styles.workspace}>
        <section className={styles.notesPanel}>
          <div className={styles.panelCard}>
            <div className={styles.cardHeader}>
              <h2>Conversation Points</h2>
              <button className={styles.inlineBtn} onClick={saveConversationPoints}>
                Save Notes
              </button>
            </div>
            <p className={styles.cardHint}>Capture key decisions, open questions, assumptions, and action items before BRD drafting.</p>
            <textarea
              rows={16}
              value={conversationPoints}
              onChange={(event) => setConversationPoints(event.target.value)}
              placeholder="Example:\n• Decision: Keep phase-1 scope to onboarding and maker-checker only\n• Open question: Need final retention period from Compliance\n• Action: Ops to share cutover window by Friday"
              className={styles.notesInput}
            />
            <div className={styles.saveMeta}>{savedAt ? `Saved at ${savedAt}` : "Not saved yet"}</div>
          </div>

          <div className={styles.panelCard}>
            <h3>Request Snapshot</h3>
            <p className={styles.brief}>{request.brief || "No brief provided."}</p>
            <div className={styles.summaryGrid}>
              {summaryItems.map((item) => (
                <div key={item.label} className={styles.summaryItem}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className={styles.chatPanel}>
          <div className={styles.chatTop}>
            <div>
              <h2>Discussion</h2>
              <p>Live thread history with decisions and follow-ups</p>
            </div>
            <span className={styles.countPill}>{filteredThreads.length} items</span>
          </div>

          <div className={styles.chatActions}>
            <button className={styles.teamsBtn} onClick={initiateTeamsMeeting}>
              Initiate Teams Meeting
            </button>
            <button className={styles.aiBtn} onClick={summarizeToConversationPoints} disabled={isSummarizing}>
              {isSummarizing ? "Summarizing..." : "AI: Add Conversation Points"}
            </button>
          </div>

          <div className={styles.searchWrap}>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search discussion by participant, title, or note"
              className={styles.searchInput}
            />
          </div>

          <div className={styles.chatList}>
            {filteredThreads.length === 0 ? (
              <p className={styles.emptyChat}>No discussion matches the search query.</p>
            ) : (
              filteredThreads.map((thread, index) => (
                <div key={thread.id} className={styles.chatMsg}>
                  <div className={styles.avatar} style={{ background: avatarColors[index % avatarColors.length] }}>
                    {getInitials(thread.participants)}
                  </div>
                  <div className={styles.bubble}>
                    <div className={styles.meta}>
                      <span>{thread.participants || "Stakeholder & BA"}</span>
                      <span>{getThreadTime(thread)}</span>
                    </div>
                    <div className={styles.messageTitle}>{thread.title}</div>
                    <p>{thread.notes || thread.transcript || "—"}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.quickReplyRow}>
            <button className={styles.quickBtn} onClick={() => setReply("Please confirm final scope for phase-1 sign-off.")}>Ask scope confirmation</button>
            <button className={styles.quickBtn} onClick={() => setReply("Sharing BRD input updates. Please confirm any missing assumptions.")}>Share update prompt</button>
          </div>

          <div className={styles.replyWrap}>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Add BA response, decision note, or follow-up question"
              className={styles.replyInput}
              rows={3}
            />
            <button className={styles.sendBtn} onClick={sendReply} disabled={!reply.trim()}>
              Send update
            </button>
          </div>
        </aside>
      </div>

      <div className={styles.footerCta}>
        <div>
          <h3>Ready to draft the BRD?</h3>
          <p>After capturing discussion points, continue to the input parameter page to generate BRD with AI.</p>
        </div>
        <Link href={`/ba-portal/requests/${request.id}/input`} className={styles.initiateBtn}>
          Initiate BRD
        </Link>
      </div>
    </div>
  );
}
