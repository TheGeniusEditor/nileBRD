"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./detail.module.css";
import {
  ConversationThread,
  StakeholderRequest,
  buildPHLTemplateBRD,
  getRequests,
  saveRequests,
} from "@/lib/workflow";

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

export default function StakeholderReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const requestId = params?.id;

  const [selected, setSelected] = useState<StakeholderRequest | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [searchText, setSearchText] = useState("");
  const [reply, setReply] = useState("");

  useEffect(() => {
    if (!requestId) {
      return;
    }

    const all = getRequests();
    const found = all.find((item) => item.id === requestId) || null;
    if (found && (found.status === "sent" || found.status === "approved" || found.status === "changes_requested")) {
      setSelected(found);
      setReviewComment(found.reviewerComment || "");
      return;
    }

    setSelected(null);
  }, [requestId]);

  const persistRequest = (updater: (item: StakeholderRequest) => StakeholderRequest) => {
    if (!selected) {
      return;
    }

    const all = getRequests();
    const next = all.map((item) => {
      if (item.id !== selected.id) {
        return item;
      }

      return updater(item);
    });

    saveRequests(next);

    const refreshed = next.find((item) => item.id === selected.id) || null;
    setSelected(refreshed);
  };

  const templateDoc = useMemo(() => {
    if (!selected || !selected.brdMaster) {
      return "";
    }

    return buildPHLTemplateBRD(selected, selected.brdMaster);
  }, [selected]);

  const submitDecision = (status: "approved" | "changes_requested") => {
    if (!selected) {
      return;
    }

    persistRequest((item) => ({
      ...item,
      status,
      reviewerComment: reviewComment,
    }));
  };

  const initiateTeamsMeeting = () => {
    if (!selected) {
      return;
    }

    const subject = encodeURIComponent(`BRD working session: ${selected.reqTitle}`);
    const content = encodeURIComponent(
      `Discussion context: ${selected.reqType} (${selected.priority}) for ${selected.tenant}`
    );

    window.open(
      `https://teams.microsoft.com/l/meeting/new?subject=${subject}&content=${content}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const sendReply = () => {
    if (!selected || !reply.trim()) {
      return;
    }

    const text = reply.trim();
    persistRequest((item) => ({
      ...item,
      threads: [
        ...(item.threads || []),
        {
          id: `${item.id}-msg-${Date.now()}`,
          title: "Stakeholder Follow-up",
          date: new Date().toLocaleString(),
          participants: "Stakeholder Team",
          notes: text,
        },
      ],
    }));

    setReply("");
  };

  const chatThreads = useMemo(() => {
    if (!selected) {
      return [] as ConversationThread[];
    }

    if ((selected.threads || []).length > 0) {
      return selected.threads;
    }

    return buildMockConversations(selected);
  }, [selected]);

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

  if (!selected) {
    return (
      <div className={styles.container}>
        <div className={styles.notFoundCard}>
          <h1>Request not found</h1>
          <p>This BRD request was not found in the review queue.</p>
          <Link href="/role/sme/review" className={styles.backBtn}>
            Back to BRD Sent by BA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role/sme/review" className={styles.backLink}>
            ← Back to BRD Sent by BA
          </Link>
          <h1>BRD Review</h1>
          <p>{selected.reqTitle}</p>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.reviewCard}>
          {!selected.brdMaster ? (
            <p className={styles.muted}>BRD not generated yet for this request.</p>
          ) : (
            <>
              <h2>{selected.reqTitle}</h2>
              <p className={styles.muted}>Current Status: {selected.status.replace("_", " ")}</p>
              <pre className={styles.pre}>{templateDoc}</pre>

              <label className={styles.reviewLabel}>
                Reviewer Comment
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  placeholder="Enter approval note or required changes"
                />
              </label>

              <div className={styles.actions}>
                <button className={styles.approveBtn} onClick={() => submitDecision("approved")}>Approve</button>
                <button className={styles.changeBtn} onClick={() => submitDecision("changes_requested")}>Make Changes</button>
              </div>
            </>
          )}
        </section>

        <aside className={styles.chatPanel}>
          <div className={styles.chatTop}>
            <h2>Discussion</h2>
            <span>{filteredThreads.length} items</span>
          </div>

          <div className={styles.chatActions}>
            <button className={styles.teamsBtn} onClick={initiateTeamsMeeting}>
              Initiate Teams Meeting
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
            <button className={styles.quickBtn} onClick={() => setReply("Please share updated BRD draft with highlighted deltas.")}>Request revision summary</button>
            <button className={styles.quickBtn} onClick={() => setReply("Sharing stakeholder review notes. Please confirm closure plan.")}>Share review notes</button>
          </div>

          <div className={styles.replyWrap}>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Add stakeholder response, decision note, or follow-up question"
              className={styles.replyInput}
              rows={3}
            />
            <button className={styles.sendBtn} onClick={sendReply} disabled={!reply.trim()}>
              Send update
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
