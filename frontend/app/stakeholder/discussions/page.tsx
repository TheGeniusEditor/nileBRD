"use client";

import { useEffect, useState } from "react";
import { Briefcase, Clock, Flame, Loader2, MessageSquare, TrendingUp, Zap } from "lucide-react";
import { RequestChat } from "@/components/chat/RequestChat";
import { Card } from "@/components/ui/Card";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface DiscussionRequest {
  id: number;
  req_number: string;
  title: string;
  priority: string;
  category: string;
  status: string;
  ba_name: string | null;
  ba_email: string | null;
  message_count: string;
  last_message: string | null;
  last_message_at: string | null;
}

function decodeToken(token: string) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}

const priorityIcon: Record<string, React.ReactNode> = {
  Low: <TrendingUp className="size-3 text-emerald-500" />,
  Medium: <Clock className="size-3 text-amber-500" />,
  High: <Zap className="size-3 text-orange-500" />,
  Critical: <Flame className="size-3 text-rose-500" />,
};

const priorityBadge: Record<string, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Critical: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function StakeholderDiscussionsPage() {
  const [requests, setRequests] = useState<DiscussionRequest[]>([]);
  const [selected, setSelected] = useState<DiscussionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: number; email: string; name: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const decoded = decodeToken(token);
    if (decoded) setCurrentUser({ id: decoded.id, email: decoded.email, name: decoded.email });

    fetch(`${API}/api/discussions/requests`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setRequests(d.requests || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!currentUser) return (
    <Card><div className="flex items-center justify-center py-12 gap-2 text-slate-400"><Loader2 className="size-5 animate-spin" />Loading...</div></Card>
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[360px,1fr]">
      {/* Request list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Your Active Requests</h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">{requests.length}</span>
        </div>

        {loading ? (
          <Card><div className="flex items-center justify-center py-8 gap-2 text-slate-400"><Loader2 className="size-4 animate-spin" />Loading...</div></Card>
        ) : requests.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center py-10 text-center">
              <MessageSquare className="mb-3 size-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No active requests</p>
              <p className="mt-1 text-xs text-slate-400">Submit a request to start a discussion</p>
            </div>
          </Card>
        ) : (
          requests.map((req) => (
            <button key={req.id} onClick={() => setSelected(req)}
              className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${selected?.id === req.id ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100" : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[10px] font-semibold text-blue-500">{req.req_number}</span>
                    <span className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${priorityBadge[req.priority] ?? "bg-slate-100 text-slate-600"}`}>
                      {priorityIcon[req.priority]} {req.priority}
                    </span>
                  </div>
                  <p className="truncate text-sm font-semibold text-slate-800">{req.title}</p>
                  {req.ba_name || req.ba_email ? (
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Briefcase className="size-3 text-purple-400" />
                      <span>{req.ba_name || req.ba_email}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs italic text-slate-400">No BA assigned yet</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {parseInt(req.message_count) > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{req.message_count}</span>
                  )}
                  {req.last_message_at && (
                    <span className="text-[10px] text-slate-400">{new Date(req.last_message_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              {req.last_message && <p className="mt-2 line-clamp-1 text-xs text-slate-500">{req.last_message}</p>}
            </button>
          ))
        )}
      </div>

      {/* Chat */}
      <div>
        {selected ? (
          <RequestChat request={selected} currentUserId={currentUser.id} currentUserName={currentUser.name} onBack={() => setSelected(null)} />
        ) : (
          <Card className="flex h-[620px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-blue-50">
              <MessageSquare className="size-8 text-blue-400" />
            </div>
            <p className="text-base font-semibold text-slate-700">Select a request to chat</p>
            <p className="mt-1 max-w-xs text-sm text-slate-400">Click any request on the left to open its discussion thread with your assigned BA</p>
          </Card>
        )}
      </div>
    </div>
  );
}
