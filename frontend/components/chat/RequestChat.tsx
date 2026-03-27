"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import {
  ArrowLeft,
  CheckCheck,
  CornerDownRight,
  Loader2,
  Paperclip,
  Send,
  Video,
  X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface ReplySnapshot {
  reply_text?: string;
  reply_sender_name?: string;
  reply_sender_email?: string;
}

interface Message extends ReplySnapshot {
  id: number;
  request_id: number;
  message: string;
  reply_to_id: number | null;
  created_at: string;
  sender_id: number;
  sender_email: string;
  sender_name: string | null;
  sender_role: string;
}

interface RequestInfo {
  id: number;
  req_number: string;
  title: string;
  priority: string;
  status: string;
}

interface Props {
  request: RequestInfo;
  currentUserId: number;
  currentUserName: string;
  onBack?: () => void;
}

function getUserInitials(name: string | null, email: string) {
  if (name?.trim()) {
    const p = name.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : p[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

const avatarColors = [
  "from-blue-500 to-blue-600", "from-purple-500 to-purple-600",
  "from-emerald-500 to-emerald-600", "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600", "from-cyan-500 to-cyan-600",
];

function Avatar({ name, email, id, size = "sm" }: { name: string | null; email: string; id: number; size?: "sm" | "md" }) {
  const color = avatarColors[id % avatarColors.length];
  const sz = size === "sm" ? "size-7 text-[10px]" : "size-9 text-xs";
  return (
    <div className={`${sz} shrink-0 rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white`}>
      {getUserInitials(name, email)}
    </div>
  );
}

function ReplyQuote({ text, senderName, senderEmail, onScrollTo }: { text: string; senderName: string | null; senderEmail: string; onScrollTo?: () => void }) {
  return (
    <button
      onClick={onScrollTo}
      className="mb-1.5 block w-full rounded-lg border-l-4 border-blue-400 bg-black/10 px-2.5 py-1.5 text-left transition-opacity hover:opacity-80"
    >
      <p className="text-[10px] font-semibold text-blue-200">{senderName || senderEmail}</p>
      <p className="mt-0.5 line-clamp-2 text-xs opacity-80">{text}</p>
    </button>
  );
}

export function RequestChat({ request, currentUserId, currentUserName, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch history + connect socket
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Load message history
    fetch(`${API}/api/discussions/messages/${request.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { setMessages(d.messages || []); setLoading(false); })
      .catch(() => setLoading(false));

    // Connect socket
    const socket = io(API, { auth: { token }, transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join-room", { requestId: request.id });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("new-message", (msg: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.emit("leave-room", { requestId: request.id });
      socket.disconnect();
    };
  }, [request.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(() => {
    if (!draft.trim() || !socketRef.current) return;
    socketRef.current.emit("send-message", {
      requestId: request.id,
      message: draft.trim(),
      replyToId: replyTo?.id ?? null,
    });
    setDraft("");
    setReplyTo(null);
    inputRef.current?.focus();
  }, [draft, replyTo, request.id]);

  const scrollToMessage = (id: number) => {
    msgRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    msgRefs.current[id]?.classList.add("ring-2", "ring-blue-400");
    setTimeout(() => msgRefs.current[id]?.classList.remove("ring-2", "ring-blue-400"), 1500);
  };

  const startTeamsMeeting = () => {
    window.open(`https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(request.title)}`, "_blank", "noopener,noreferrer");
  };

  const priorityColors: Record<string, string> = {
    Low: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-orange-100 text-orange-700",
    Critical: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="flex h-[620px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
        {onBack && (
          <button onClick={onBack} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <ArrowLeft className="size-4" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-blue-500">{request.req_number}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityColors[request.priority] ?? "bg-slate-100 text-slate-600"}`}>
              {request.priority}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <span className={`size-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-slate-300"}`} />
              {connected ? "Live" : "Connecting..."}
            </span>
          </div>
          <p className="truncate text-sm font-semibold text-slate-800">{request.title}</p>
        </div>
        <button
          onClick={startTeamsMeeting}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 hover:shadow-sm"
        >
          <Video className="size-3.5" />
          Teams Meeting
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}>
        {loading ? (
          <div className="flex h-full items-center justify-center gap-2 text-slate-400">
            <Loader2 className="size-5 animate-spin" /> Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-blue-50">
              <Paperclip className="size-6 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">No messages yet</p>
            <p className="mt-1 text-xs text-slate-400">Start the discussion about this request</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMe = msg.sender_id === currentUserId;
              const showAvatar = !isMe && (i === 0 || messages[i - 1].sender_id !== msg.sender_id);
              const showName = !isMe && showAvatar;
              const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <div
                  key={msg.id}
                  ref={(el) => { msgRefs.current[msg.id] = el; }}
                  className={`group flex items-end gap-2 transition-all duration-300 ${isMe ? "justify-end" : "justify-start"}`}
                  onMouseEnter={() => setHoveredId(msg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Avatar placeholder for alignment */}
                  {!isMe && (
                    <div className="w-7 shrink-0">
                      {showAvatar && <Avatar name={msg.sender_name} email={msg.sender_email} id={msg.sender_id} />}
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%]`}>
                    {showName && (
                      <span className="mb-1 ml-1 text-[10px] font-semibold text-slate-500">
                        {msg.sender_name || msg.sender_email}
                        <span className="ml-1 font-normal capitalize text-slate-400">· {msg.sender_role}</span>
                      </span>
                    )}

                    <div className="relative flex items-end gap-1.5">
                      {/* Reply button — shows on hover */}
                      {hoveredId === msg.id && (
                        <button
                          onClick={() => { setReplyTo(msg); inputRef.current?.focus(); }}
                          className={`mb-1 rounded-full border border-slate-200 bg-white p-1 text-slate-400 shadow-sm hover:text-blue-500 transition-colors ${isMe ? "order-first" : "order-last"}`}
                        >
                          <CornerDownRight className="size-3" />
                        </button>
                      )}

                      <div
                        className={`relative rounded-2xl px-3.5 py-2.5 shadow-sm transition-all duration-200 ${
                          isMe
                            ? "rounded-br-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                            : "rounded-bl-sm border border-slate-200 bg-white text-slate-900"
                        }`}
                      >
                        {/* Reply quote inside bubble */}
                        {msg.reply_to_id && msg.reply_text && (
                          <ReplyQuote
                            text={msg.reply_text}
                            senderName={msg.reply_sender_name ?? null}
                            senderEmail={msg.reply_sender_email ?? ""}
                            onScrollTo={() => scrollToMessage(msg.reply_to_id!)}
                          />
                        )}

                        <p className="text-sm leading-relaxed">{msg.message}</p>

                        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                          {time}
                          {isMe && <CheckCheck className="size-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="flex items-center gap-3 border-t border-slate-100 bg-blue-50 px-4 py-2">
          <CornerDownRight className="size-4 shrink-0 text-blue-400" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold text-blue-600">{replyTo.sender_name || replyTo.sender_email}</p>
            <p className="truncate text-xs text-slate-600">{replyTo.message}</p>
          </div>
          <button onClick={() => setReplyTo(null)} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <button
          onClick={send}
          disabled={!draft.trim() || !connected}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
