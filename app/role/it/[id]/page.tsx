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

type FeasibilityStatus = "pending" | "feasible" | "needs_info" | "not_feasible";

type FeasibilityState = {
  requestId: string;
  status: FeasibilityStatus;
  notes: string;
  updatedAt?: string;
};

const IT_FEASIBILITY_KEY = "itFeasibilityState";

const avatarColors = ["#ec4899", "#10b981", "#f59e0b", "#2563eb", "#8b5cf6", "#ef4444"];

const defaultFeasibilityState = (requestId: string): FeasibilityState => ({
  requestId,
  status: "pending",
  notes: "",
});

const loadFeasibilityMap = (): Record<string, FeasibilityState> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(IT_FEASIBILITY_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as Record<string, FeasibilityState>;
  } catch {
    return {};
  }
};

const saveFeasibilityMap = (map: Record<string, FeasibilityState>) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(IT_FEASIBILITY_KEY, JSON.stringify(map));
};

const statusLabel = (status: FeasibilityStatus) => status.replace("_", " ");

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

export default function ItFeasibilityDetailPage() {
  const params = useParams<{ id: string }>();
  const requestId = params?.id;

  const [selected, setSelected] = useState<StakeholderRequest | null>(null);
  const [searchText, setSearchText] = useState("");
  const [reply, setReply] = useState("");
  const [feasibility, setFeasibility] = useState<FeasibilityState | null>(null);

  useEffect(() => {
    if (!requestId) {
      return;
    }

    const all = getRequests();
    const found = all.find((item) => item.id === requestId) || null;
    if (found && found.status === "approved") {
      setSelected(found);
      const map = loadFeasibilityMap();
      const current = map[found.id] || defaultFeasibilityState(found.id);
      setFeasibility(current);
      return;
    }

    setSelected(null);
    setFeasibility(null);
  }, [requestId]);

  const persistFeasibility = (updater: (current: FeasibilityState) => FeasibilityState) => {
    if (!selected || !feasibility) {
      return;
    }

    const map = loadFeasibilityMap();
    const updated = updater(feasibility);
    const next = {
      ...map,
      [selected.id]: updated,
    };

    saveFeasibilityMap(next);
    setFeasibility(updated);
  };

  const updateStatus = (status: FeasibilityStatus) => {
    if (!feasibility) {
      return;
    }

    persistFeasibility((current) => ({
      ...current,
      status,
      updatedAt: new Date().toLocaleString(),
    }));
  };

  const updateNotes = (notes: string) => {
    if (!feasibility) {
      return;
    }

    persistFeasibility((current) => ({
      ...current,
      notes,
    }));
  };

  const templateDoc = useMemo(() => {
    if (!selected || !selected.brdMaster) {
      return "";
    }

    return buildPHLTemplateBRD(selected, selected.brdMaster);
  }, [selected]);

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
    const all = getRequests();
    const next = all.map((item) => {
      if (item.id !== selected.id) {
        return item;
      }

      return {
        ...item,
        threads: [
          ...(item.threads || []),
          {
            id: `${item.id}-msg-${Date.now()}`,
            title: "IT Feasibility Note",
            date: new Date().toLocaleString(),
            participants: "IT Team",
            notes: text,
          },
        ],
      };
    });

    saveRequests(next);
    setSelected(next.find((item) => item.id === selected.id) || null);
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

  if (!selected || !feasibility) {
    return (
      <div className={styles.container}>
        <div className={styles.notFoundCard}>
          <h1>Request not found</h1>
          <p>This BRD is not in the approved queue.</p>
          <Link href="/role/it" className={styles.backBtn}>
            Back to IT Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role/it" className={styles.backLink}>
            ← Back to IT Portal
          </Link>
          <h1>Internal Feasibility Review</h1>
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
              <p className={styles.muted}>Status: {selected.status.replace("_", " ")}</p>
              <pre className={styles.pre}>{templateDoc}</pre>

              <div className={styles.statusRow}>
                <span className={styles.statusLabel}>Current Status</span>
                <span className={styles.statusValue}>{statusLabel(feasibility.status)}</span>
                {feasibility.updatedAt && (
                  <span className={styles.statusMeta}>Updated {feasibility.updatedAt}</span>
                )}
              </div>

              <div className={styles.actionRow}>
                <button className={styles.primaryBtn} onClick={() => updateStatus("feasible")}>
                  Mark Feasible
                </button>
                <button className={styles.secondaryBtn} onClick={() => updateStatus("needs_info")}>
                  Needs Info
                </button>
                <button className={styles.dangerBtn} onClick={() => updateStatus("not_feasible")}>
                  Not Feasible
                </button>
              </div>

              <label className={styles.fullWidthLabel}>
                Internal Review Notes
                <textarea
                  rows={4}
                  value={feasibility.notes}
                  onChange={(event) => updateNotes(event.target.value)}
                  placeholder="Record dependencies, capacity checks, expected risks, and feasibility notes"
                />
              </label>
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
            <button className={styles.quickBtn} onClick={() => setReply("Sharing IT feasibility notes. Please confirm missing dependencies.")}>Share feasibility notes</button>
            <button className={styles.quickBtn} onClick={() => setReply("Need additional system details to finalize feasibility.")}>Request more info</button>
          </div>

          <div className={styles.replyWrap}>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              placeholder="Add IT update, dependency note, or follow-up question"
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
