"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./input.module.css";
import {
  BRDMasterData,
  ConversationThread,
  StakeholderRequest,
  applyMockAiGeneration,
  defaultBRDMasterFromRequest,
  getRequests,
  saveRequests,
} from "@/lib/workflow";

const avatarColors = ["#ec4899", "#10b981", "#f59e0b", "#2563eb", "#8b5cf6", "#ef4444"];

type TranscriptAlternative = {
  transcript: string;
};

type TranscriptResult = {
  [index: number]: TranscriptAlternative;
  length: number;
};

type TranscriptResultList = {
  [index: number]: TranscriptResult;
  length: number;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: TranscriptResultList;
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const buildConversationPoints = (content: string): string[] => {
  const unique = new Set<string>();
  const sentences = content
    .split(/\n+|(?<=[.!?])\s+/)
    .map((line) => line.replace(/^[\-•\d.\s]+/, "").trim())
    .filter((line) => line.length >= 18);

  for (const sentence of sentences) {
    const normalized = sentence.toLowerCase();
    if (!unique.has(normalized)) {
      unique.add(normalized);
    }
    if (unique.size >= 8) {
      break;
    }
  }

  return Array.from(unique).map((point) => point[0].toUpperCase() + point.slice(1));
};

const buildMasterFromConversationPoints = (
  current: BRDMasterData,
  points: string[],
  request: StakeholderRequest
): BRDMasterData => {
  const joined = points.join("\n- ");
  const lowerPoints = points.map((point) => point.toLowerCase());
  const pickMatches = (keywords: string[]) =>
    points.filter((point, index) => keywords.some((keyword) => lowerPoints[index].includes(keyword)));

  const assumptions = pickMatches(["assum", "depend", "expect", "consider", "if "]);
  const constraints = pickMatches(["constraint", "limit", "cannot", "must", "deadline", "budget"]);
  const kpis = pickMatches(["kpi", "%", "target", "sla", "turnaround", "time", "metric"]);
  const scopeOut = pickMatches(["out of scope", "later", "future", "exclude", "phase 2"]);
  const security = pickMatches(["security", "compliance", "risk", "audit", "privacy", "pii"]);
  const integrations = pickMatches(["integrat", "source", "consumer", "api", "system", "data"]);

  return {
    ...current,
    objective: points[0] || current.objective,
    process: `Meeting conversation points:\n- ${joined || "No key points captured yet."}`,
    scopeIn: points.slice(0, 4).join("\n") || current.scopeIn,
    scopeOut: scopeOut.length > 0 ? scopeOut.join("\n") : current.scopeOut,
    assumptions: assumptions.length > 0 ? assumptions.join("\n") : current.assumptions,
    constraints: constraints.length > 0 ? constraints.join("\n") : current.constraints,
    kpis: kpis.length > 0 ? kpis.join("\n") : current.kpis,
    sources: integrations.length > 0 ? integrations.join("\n") : current.sources,
    consumers: integrations.length > 1 ? integrations.slice(1).join("\n") : current.consumers,
    securityControls:
      security.length > 0
        ? security.join("\n")
        : current.securityControls,
    regMap:
      security.length > 0
        ? `${current.regMap}\nDiscussion emphasis: ${request.reqType} governance and control checkpoints.`
        : current.regMap,
  };
};

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

export default function RequestInputPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = params?.id;

  const [request, setRequest] = useState<StakeholderRequest | null>(null);
  const [master, setMaster] = useState<BRDMasterData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isApplyingPoints, setIsApplyingPoints] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [reply, setReply] = useState("");
  const [meetingTranscript, setMeetingTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const [conversationPoints, setConversationPoints] = useState<string[]>([]);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const getMeetingContextText = () => {
    const threadText = chatThreads
      .map((thread) => `${thread.title}. ${thread.notes || ""}. ${thread.transcript || ""}`)
      .join("\n");
    return `${request?.brief || ""}\n${threadText}\n${meetingTranscript}`;
  };

  useEffect(() => {
    if (!requestId) {
      return;
    }

    const all = getRequests();
    const found = all.find((item) => item.id === requestId) || null;
    setRequest(found);

    if (found) {
      setMaster({
        ...defaultBRDMasterFromRequest(found),
        ...(found.brdMaster ?? {}),
      });
      return;
    }

    setMaster(null);
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
    if (refreshed) {
      setRequest(refreshed);
      setMaster({
        ...defaultBRDMasterFromRequest(refreshed),
        ...(refreshed.brdMaster ?? {}),
      });
    }
  };

  useEffect(() => {
    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
    };
  }, []);

  const setField = (key: keyof BRDMasterData, value: string) => {
    setMaster((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [key]: value,
      };
    });
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

  const startTranscriptRecording = () => {
    if (typeof window === "undefined") {
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const RecognitionCtor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!RecognitionCtor) {
      setRecordingError("Live recording is not supported in this browser. Paste transcript manually below.");
      return;
    }

    const recognition = new RecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let partial = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        partial += event.results[index][0].transcript;
      }

      if (!partial.trim()) {
        return;
      }

      setMeetingTranscript((prev) => `${prev}${prev.trim() ? " " : ""}${partial.trim()}`);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      setRecordingError(event?.error ? `Recorder error: ${event.error}` : "Unable to record transcript.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    speechRecognitionRef.current = recognition;
    setIsRecording(true);
    setRecordingError("");
  };

  const stopTranscriptRecording = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const saveTranscriptToChat = () => {
    if (!request || !meetingTranscript.trim()) {
      return;
    }

    const transcript = meetingTranscript.trim();
    persistRequest((item) => ({
      ...item,
      status: item.status === "approved" ? "approved" : "in_progress",
      threads: [
        ...(item.threads || []),
        {
          id: `${item.id}-transcript-${Date.now()}`,
          title: "Meeting Transcript",
          date: new Date().toLocaleString(),
          participants: "BA Meeting",
          transcript,
          notes: transcript.slice(0, 260),
        },
      ],
    }));

    setMeetingTranscript("");
  };

  const summarizeConversationPoints = async () => {
    const context = getMeetingContextText();
    if (!context.trim()) {
      return;
    }

    setIsSummarizing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const points = buildConversationPoints(context);
    setConversationPoints(points);
    setIsSummarizing(false);
  };

  const fillParametersFromConversationPoints = async () => {
    if (!request || !master) {
      return;
    }

    setIsApplyingPoints(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const points =
      conversationPoints.length > 0
        ? conversationPoints
        : buildConversationPoints(getMeetingContextText());

    if (points.length > 0) {
      setConversationPoints(points);
      setMaster((prev) => (prev ? buildMasterFromConversationPoints(prev, points, request) : prev));
    }

    setIsApplyingPoints(false);
  };

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

  const saveDraft = () => {
    if (!request || !master) {
      return;
    }

    persistRequest((item) => ({
      ...item,
      status: item.status === "approved" ? "approved" : "in_progress",
      brdMaster: master,
    }));
  };

  const buildWithAI = async () => {
    if (!request || !master) {
      return;
    }

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 900));

    const generated = applyMockAiGeneration(master);

    persistRequest((item) => ({
      ...item,
      status: "generated",
      aiGeneratedAt: new Date().toLocaleString(),
      brdMaster: generated,
    }));

    setIsGenerating(false);
    router.push(`/ba-portal/requests/${request.id}/preview`);
  };

  if (!request || !master) {
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
          <Link href={`/ba-portal/requests/${request.id}`} className={styles.backLink}>
            ← Back to Conversation Workspace
          </Link>
          <h1>Input Parameters</h1>
          <p>{request.reqTitle}</p>
        </div>
      </header>

      <main className={styles.editorContainer}>
        <section className={styles.paper}>
          <div className={styles.paperHeader}>
            <label>
              BRD Title
              <input
                className={styles.titleInput}
                value={master.title}
                onChange={(event) => setField("title", event.target.value)}
              />
            </label>
            <div className={styles.metaRow}>
              <span>Owner: {request.owner || "BA Team"}</span>
              <span>Status: {request.status.replace("_", " ")}</span>
            </div>
          </div>

          <div className={styles.formGrid}>
            <label>
              Business Unit / Function
              <input value={master.bu} onChange={(event) => setField("bu", event.target.value)} />
            </label>
            <label>
              Domain
              <input value={master.domain} onChange={(event) => setField("domain", event.target.value)} />
            </label>
            <label>
              Product
              <input value={master.product} onChange={(event) => setField("product", event.target.value)} />
            </label>
            <label>
              Priority
              <select value={master.priority} onChange={(event) => setField("priority", event.target.value)}>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </label>

            <label className={styles.fullWidth}>
              Business Objective
              <textarea rows={3} value={master.objective} onChange={(event) => setField("objective", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Success Metrics / KPIs
              <textarea rows={3} value={master.kpis} onChange={(event) => setField("kpis", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Assumptions
              <textarea rows={3} value={master.assumptions} onChange={(event) => setField("assumptions", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Constraints
              <textarea rows={3} value={master.constraints} onChange={(event) => setField("constraints", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Scope In
              <textarea rows={3} value={master.scopeIn} onChange={(event) => setField("scopeIn", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Scope Out
              <textarea rows={3} value={master.scopeOut} onChange={(event) => setField("scopeOut", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Process Narrative
              <textarea rows={3} value={master.process} onChange={(event) => setField("process", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Upstream Data Sources
              <textarea rows={3} value={master.sources} onChange={(event) => setField("sources", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Downstream Consumers
              <textarea rows={3} value={master.consumers} onChange={(event) => setField("consumers", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Regulatory Mapping
              <textarea rows={3} value={master.regMap} onChange={(event) => setField("regMap", event.target.value)} />
            </label>
            <label className={styles.fullWidth}>
              Security Controls
              <textarea rows={3} value={master.securityControls} onChange={(event) => setField("securityControls", event.target.value)} />
            </label>
          </div>

          <div className={styles.actions}>
            <button className={styles.secondaryBtn} onClick={saveDraft}>
              Save BRD Draft
            </button>
            <button className={styles.primaryBtn} onClick={buildWithAI} disabled={isGenerating}>
              {isGenerating ? "Building..." : "Build BRD with AI"}
            </button>
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
          </div>

          <div className={styles.transcriptWrap}>
            <div className={styles.transcriptHead}>
              <h3>Meeting Transcript</h3>
              <span>{isRecording ? "Recording..." : "Ready"}</span>
            </div>
            <div className={styles.transcriptActions}>
              <button className={styles.quickBtn} onClick={startTranscriptRecording} disabled={isRecording}>
                Start recording
              </button>
              <button className={styles.quickBtn} onClick={stopTranscriptRecording} disabled={!isRecording}>
                Stop
              </button>
              <button className={styles.quickBtn} onClick={saveTranscriptToChat} disabled={!meetingTranscript.trim()}>
                Save transcript
              </button>
            </div>
            <textarea
              className={styles.transcriptInput}
              rows={4}
              value={meetingTranscript}
              onChange={(event) => setMeetingTranscript(event.target.value)}
              placeholder="Record or paste meeting transcript here"
            />
            {recordingError ? <p className={styles.recordingError}>{recordingError}</p> : null}
          </div>

          <div className={styles.aiActions}>
            <button className={styles.aiBtn} onClick={summarizeConversationPoints} disabled={isSummarizing}>
              {isSummarizing ? "Summarizing..." : "AI: Summarize Conversation Points"}
            </button>
            <button className={styles.aiBtn} onClick={fillParametersFromConversationPoints} disabled={isApplyingPoints}>
              {isApplyingPoints ? "Filling..." : "AI: Fill Input Parameters"}
            </button>
          </div>

          {conversationPoints.length > 0 ? (
            <div className={styles.pointsWrap}>
              <h3>Conversation Points</h3>
              <ul>
                {conversationPoints.map((point, index) => (
                  <li key={`${point}-${index}`}>{point}</li>
                ))}
              </ul>
            </div>
          ) : null}

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
      </main>
    </div>
  );
}
