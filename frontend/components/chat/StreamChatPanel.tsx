"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import type { Channel as StreamChannel } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  MessageSimple,
  useMessageContext,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import "./stream-overrides.css";
import { getStreamClient, fetchStreamToken } from "@/lib/streamClient";
import { VideoMeetingModal } from "./VideoMeetingModal";
import { MemberManagementPanel } from "./MemberManagementPanel";
import {
  ArrowLeft, Video, Users, Loader2, MessageSquare, AlertCircle,
  Bookmark, BookmarkCheck, Sparkles, X, ChevronRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

const priorityConfig: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  Low:      { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
  Medium:   { dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200" },
  High:     { dot: "bg-orange-500",  text: "text-orange-700",  bg: "bg-orange-50",   border: "border-orange-200" },
  Critical: { dot: "bg-rose-500",    text: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-200" },
};

interface RequestInfo {
  id: number;
  req_number: string;
  title: string;
  priority: string;
  status: string;
}

interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface ImportantMessage {
  stream_message_id: string;
  message_text: string;
  sender_name: string;
  marked_at: string;
}

interface Props {
  request: RequestInfo;
  currentUser: CurrentUser;
  onBack?: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────
const ImportantCtx = createContext<{
  importantIds: Set<string>;
  toggle: (id: string, text: string, sender: string) => void;
  isBA: boolean;
}>({ importantIds: new Set(), toggle: () => {}, isBA: false });

// ── Custom message — bookmark button only for BA ───────────────────────────────
function CustomMessage() {
  const { message } = useMessageContext();
  const { importantIds, toggle, isBA } = useContext(ImportantCtx);
  const isImportant = importantIds.has(message.id ?? "");

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!message.id) return;
    const text = typeof message.text === "string" ? message.text : "";
    const sender = message.user?.name || message.user?.id || "";
    toggle(message.id, text, sender);
  };

  return (
    <div className="group relative">
      <MessageSimple />
      {/* Bookmark only visible to BA */}
      {isBA && message.id && (
        <button
          onClick={handleToggle}
          title={isImportant ? "Remove from key points" : "Mark as key point"}
          className={`absolute right-2 top-1 z-10 rounded-lg p-1.5 transition-all duration-150 ${
            isImportant
              ? "opacity-100 bg-amber-50 text-amber-500 shadow-sm shadow-amber-100"
              : "opacity-0 group-hover:opacity-100 bg-white/90 text-slate-300 hover:text-amber-500 hover:bg-amber-50 shadow-sm"
          }`}
        >
          {isImportant
            ? <BookmarkCheck className="size-3.5 fill-amber-200 stroke-amber-500" />
            : <Bookmark className="size-3.5" />
          }
        </button>
      )}
      {/* Non-BA: just show filled bookmark indicator, no button */}
      {!isBA && isImportant && (
        <span className="absolute right-2 top-1 z-10 rounded-lg bg-amber-50 p-1.5">
          <BookmarkCheck className="size-3.5 fill-amber-200 stroke-amber-500" />
        </span>
      )}
    </div>
  );
}

// ── Key Points panel ──────────────────────────────────────────────────────────
function KeyPointsPanel({
  messages,
  isBA,
  onClose,
}: {
  messages: ImportantMessage[];
  isBA: boolean;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 z-20 flex w-[340px] flex-col bg-white shadow-2xl">
      {/* Accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 shrink-0" />

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-sm shadow-amber-200">
            <Sparkles className="size-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Key Points</p>
            <p className="text-[11px] text-slate-400">
              {messages.length} {messages.length === 1 ? "point" : "points"} marked
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
              <Bookmark className="size-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">No key points yet</p>
            {isBA ? (
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                Hover over any message and click the{" "}
                <span className="inline-flex items-center gap-0.5 font-medium text-amber-500">
                  <Bookmark className="size-3 inline" /> bookmark
                </span>{" "}
                icon to mark it as a key point for BRD generation.
              </p>
            ) : (
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                Key points marked by the BA will appear here.
              </p>
            )}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.stream_message_id}
              className="group rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 transition-colors hover:border-amber-200 hover:bg-amber-50/50"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-relaxed text-slate-700">{msg.message_text}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-500">{msg.sender_name}</span>
                    <span className="text-[10px] text-slate-300">·</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.marked_at).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer — Generate button for BA only */}
      <div className="shrink-0 border-t border-slate-100 p-4 space-y-2">
        {isBA && messages.length > 0 && (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-md hover:shadow-indigo-200"
          >
            <Sparkles className="size-4" />
            Generate BRD Summary
            <ChevronRight className="size-4 opacity-70" />
          </button>
        )}
        <p className="text-center text-[10px] text-slate-400">
          {isBA
            ? "Marked messages will be used by AI to generate BRD key points"
            : "Only the BA can mark and generate key points"}
        </p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function StreamChatPanel({ request, currentUser, onBack }: Props) {
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);
  const [loadingMeeting, setLoadingMeeting] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [importantMessages, setImportantMessages] = useState<ImportantMessage[]>([]);

  const isBA = currentUser.role === "ba";
  const importantIds = new Set(importantMessages.map((m) => m.stream_message_id));
  const pc = priorityConfig[request.priority] ?? priorityConfig.Medium;

  const fetchImportant = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API}/api/stream/channels/${request.id}/important`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.messages) setImportantMessages(data.messages);
    } catch { /* non-critical */ }
  }, [request.id]);

  const toggleImportant = useCallback(async (msgId: string, text: string, sender: string) => {
    if (!isBA) return; // guard: only BA can toggle
    const token = localStorage.getItem("authToken");
    if (importantIds.has(msgId)) {
      setImportantMessages((prev) => prev.filter((m) => m.stream_message_id !== msgId));
      await fetch(`${API}/api/stream/channels/${request.id}/important/${encodeURIComponent(msgId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      const newMsg: ImportantMessage = {
        stream_message_id: msgId,
        message_text: text,
        sender_name: sender,
        marked_at: new Date().toISOString(),
      };
      setImportantMessages((prev) => [...prev, newMsg]);
      await fetch(`${API}/api/stream/channels/${request.id}/important`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ streamMessageId: msgId, messageText: text, senderName: sender }),
      });
    }
  }, [request.id, importantIds, isBA]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { token, userId } = await fetchStreamToken();
        const client = getStreamClient();

        if (!client.userID) {
          await client.connectUser(
            { id: userId, name: currentUser.name || currentUser.email },
            token
          );
        }

        if (isBA) {
          const authToken = localStorage.getItem("authToken");
          await fetch(`${API}/api/stream/channels/${request.id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        const ch = client.channel("messaging", `request-${request.id}`);
        await ch.watch();

        if (!cancelled) {
          setChannel(ch);
          setLoading(false);
          fetchImportant();
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes("Channel not found") || msg.includes("not a member")) {
            setError("This channel hasn't been set up yet. The assigned BA will initialise it when they open the discussion.");
          } else {
            setError("Failed to connect to chat. Please refresh and try again.");
          }
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      channel?.stopWatching().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.id, currentUser.id]);

  const startMeeting = useCallback(async () => {
    setLoadingMeeting(true);
    try {
      const authToken = localStorage.getItem("authToken");
      const res = await fetch(`${API}/api/stream/daily/rooms`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: request.id }),
      });
      const { url } = await res.json();
      setMeetingUrl(url);
    } finally {
      setLoadingMeeting(false);
    }
  }, [request.id]);

  return (
    <ImportantCtx.Provider value={{ importantIds, toggle: toggleImportant, isBA }}>
      <div className="relative flex h-full flex-col bg-white">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="shrink-0 border-b border-slate-100 bg-white">
          {/* Top accent gradient */}
          <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />

          <div className="flex items-center gap-4 px-5 py-4">
            {/* Back button */}
            {onBack && (
              <button
                onClick={onBack}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}

            {/* Request info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-semibold text-indigo-400">{request.req_number}</span>
                <span className="text-slate-300">·</span>
                <p className="text-sm font-semibold text-slate-800 truncate">{request.title}</p>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${pc.text} ${pc.bg} ${pc.border}`}>
                  <span className={`size-1.5 rounded-full ${pc.dot}`} />
                  {request.priority}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
                  {request.status}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Key Points */}
              <button
                onClick={() => { setShowKeyPoints(v => !v); setShowMembers(false); }}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                  showKeyPoints
                    ? "border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700 shadow-sm shadow-amber-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                <Sparkles className={`size-4 ${showKeyPoints ? "text-amber-500" : "text-slate-400"}`} />
                Key Points
                {importantMessages.length > 0 && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    showKeyPoints ? "bg-amber-200 text-amber-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {importantMessages.length}
                  </span>
                )}
              </button>

              {/* Members (BA only) */}
              {isBA && (
                <button
                  onClick={() => { setShowMembers(v => !v); setShowKeyPoints(false); }}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
                    showMembers
                      ? "border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 text-violet-700 shadow-sm shadow-violet-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <Users className={`size-4 ${showMembers ? "text-violet-500" : "text-slate-400"}`} />
                  Members
                </button>
              )}

              {/* Video Meeting */}
              <button
                onClick={startMeeting}
                disabled={loadingMeeting}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
              >
                {loadingMeeting
                  ? <Loader2 className="size-4 animate-spin text-indigo-400" />
                  : <Video className="size-4 text-indigo-400" />}
                {loadingMeeting ? "Starting…" : "Video Call"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Chat body ──────────────────────────────────────────────────────── */}
        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50">
                <Loader2 className="size-6 animate-spin text-indigo-500" />
              </div>
              <p className="text-sm font-medium text-slate-500">Connecting to chat…</p>
            </div>
          ) : error ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                {error.includes("set up")
                  ? <MessageSquare className="size-6 text-slate-300" />
                  : <AlertCircle className="size-6 text-rose-400" />
                }
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Chat unavailable</p>
                <p className="mt-1 text-xs text-slate-400">{error}</p>
              </div>
            </div>
          ) : channel ? (
            <div className="absolute inset-0 bg-slate-50/30">
              <Chat client={getStreamClient()} theme="str-chat__theme-light">
                <Channel channel={channel} Message={CustomMessage}>
                  <Window>
                    <MessageList />
                    <MessageInput focus />
                  </Window>
                  <Thread />
                </Channel>
              </Chat>
            </div>
          ) : null}

          {/* Key Points panel */}
          {showKeyPoints && (
            <KeyPointsPanel
              messages={importantMessages}
              isBA={isBA}
              onClose={() => setShowKeyPoints(false)}
            />
          )}

          {/* Members panel */}
          {showMembers && isBA && (
            <MemberManagementPanel
              requestId={request.id}
              onClose={() => setShowMembers(false)}
            />
          )}
        </div>

        {/* Video meeting modal */}
        {meetingUrl && (
          <VideoMeetingModal
            roomUrl={meetingUrl}
            onClose={() => setMeetingUrl(null)}
          />
        )}
      </div>
    </ImportantCtx.Provider>
  );
}
