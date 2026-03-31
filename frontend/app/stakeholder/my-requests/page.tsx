"use client";

import { useEffect, useState } from "react";
import {
  Loader2, FileText, Paperclip, Download, CalendarDays,
  Briefcase, ChevronDown, Check, MessageSquare, Info, Users,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useDiscussionPanel } from "@/components/dashboard/DiscussionPanel";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

interface Attachment { id: number; original_name: string; mimetype: string; size: number; }

interface RequestItem {
  id: number;
  req_number: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  assignment_mode: string;
  created_at: string;
  ba_name: string | null;
  ba_email: string | null;
  stakeholder_name?: string | null;
  stakeholder_email?: string | null;
  attachments: Attachment[];
}

const WORKFLOW = ["Submitted", "BA Assigned", "BRD", "FRD", "Dev", "UAT", "Closed"];
const statusStep: Record<string, number> = {
  Submitted: 0, "BA Assigned": 1, BRD: 2, FRD: 3, Dev: 4, UAT: 5,
  Approved: 6, Closed: 6, Rejected: 0,
};

function formatSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}
function readJwt(field: string): string {
  try {
    const t = localStorage.getItem("authToken");
    if (!t) return "";
    return JSON.parse(atob(t.split(".")[1]))[field] ?? "";
  } catch { return ""; }
}

function WorkflowTracker({ status }: { status: string }) {
  const current = statusStep[status] ?? 0;
  const rejected = status === "Rejected";
  return (
    <div className="flex items-start w-full">
      {WORKFLOW.map((step, i) => {
        const done   = !rejected && i < current;
        const active = !rejected && i === current;
        const last   = i === WORKFLOW.length - 1;
        return (
          <div key={step} className="flex flex-col items-center flex-1 min-w-0">
            <div className="flex items-center w-full">
              <div className={`h-px flex-1 ${i === 0 ? "invisible" : done ? "bg-indigo-400" : "bg-slate-200"}`} />
              <div className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold z-10 transition-colors ${
                done    ? "border-indigo-500 bg-indigo-500 text-white" :
                active  ? "border-indigo-500 bg-white text-indigo-600" :
                rejected && i === 0 ? "border-rose-400 bg-rose-400 text-white" :
                          "border-slate-200 bg-white text-slate-300"
              }`}>
                {done ? <Check size={12} strokeWidth={2.5} /> : i + 1}
              </div>
              <div className={`h-px flex-1 ${last ? "invisible" : done ? "bg-indigo-400" : "bg-slate-200"}`} />
            </div>
            <p className={`mt-2 text-center text-[10px] font-medium leading-tight px-0.5 ${
              active ? "text-indigo-600" : done ? "text-slate-500" : "text-slate-300"
            }`}>{step}</p>
          </div>
        );
      })}
    </div>
  );
}

function DetailsPanel({ req, downloading, onDownload }: {
  req: RequestItem;
  downloading: number | null;
  onDownload: (id: number, name: string) => void;
}) {
  return (
    <div className="border-t border-slate-100 px-6 pb-6 pt-5 space-y-6 animate-fade-in">
      <WorkflowTracker status={req.status} />

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 text-slate-400" />
          Submitted {formatDate(req.created_at)}
        </span>
        {req.ba_name || req.ba_email ? (
          <span className="flex items-center gap-1.5 text-indigo-600">
            <Briefcase className="size-3.5" />
            {req.ba_name || req.ba_email}
          </span>
        ) : (
          <span className="italic text-amber-500">Awaiting BA assignment</span>
        )}
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">{req.category}</span>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Description</p>
        <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
          {req.description}
        </p>
      </div>

      {req.attachments.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            Attachments ({req.attachments.length})
          </p>
          <div className="space-y-1.5">
            {req.attachments.map(att => (
              <div key={att.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <Paperclip className="size-3.5 shrink-0 text-slate-400" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{att.original_name}</p>
                    <p className="text-[10px] text-slate-400">{formatSize(att.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDownload(att.id, att.original_name)}
                  disabled={downloading === att.id}
                  className="ml-4 flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50"
                >
                  {downloading === att.id ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RequestRow({
  req,
  expandedId,
  onToggleDetails,
  onOpenDiscussion,
  downloading,
  onDownload,
  showSubmitter = false,
}: {
  req: RequestItem;
  expandedId: number | null;
  onToggleDetails: (id: number) => void;
  onOpenDiscussion: (req: RequestItem) => void;
  downloading: number | null;
  onDownload: (id: number, name: string) => void;
  showSubmitter?: boolean;
}) {
  const isExpanded = expandedId === req.id;

  return (
    <div className={`rounded-xl border bg-white overflow-hidden transition-all duration-200 ${
      isExpanded ? "border-indigo-200 shadow-sm shadow-indigo-50" : "border-slate-200 hover:border-slate-300"
    }`}>
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-slate-400 shrink-0">{req.req_number}</span>
            <p className="text-sm font-medium text-slate-800 truncate">{req.title}</p>
          </div>
          {showSubmitter && (req.stakeholder_name || req.stakeholder_email) && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
              <Users className="size-3" />
              {req.stakeholder_name || req.stakeholder_email}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={req.priority} />
          <StatusBadge status={req.status} />

          <button
            onClick={() => onToggleDetails(req.id)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
              isExpanded
                ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Info className="size-3.5" />
            Details
            <ChevronDown className={`size-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          <button
            onClick={() => onOpenDiscussion(req)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-all hover:bg-indigo-100 hover:border-indigo-300"
          >
            <MessageSquare className="size-3.5" />
            Discussion
          </button>
        </div>
      </div>

      {isExpanded && (
        <DetailsPanel req={req} downloading={downloading} onDownload={onDownload} />
      )}
    </div>
  );
}

export default function MyRequestsPage() {
  const [myRequests, setMyRequests]         = useState<RequestItem[]>([]);
  const [sharedRequests, setSharedRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading]               = useState(true);
  const [expandedId, setExpandedId]         = useState<number | null>(null);
  const [downloading, setDownloading]       = useState<number | null>(null);
  const [userId, setUserId]                 = useState(0);
  const [userName, setUserName]             = useState("");
  const { openDiscussion } = useDiscussionPanel();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) { setLoading(false); return; }
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id);
      setUserName(decoded.name || decoded.email || "You");
    } catch { /* ignore */ }

    Promise.all([
      fetch(`${API}/api/requests/my`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/api/requests/shared-with-me`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([mine, shared]) => {
      setMyRequests(mine.requests || []);
      setSharedRequests(shared.requests || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const downloadAttachment = async (id: number, filename: string) => {
    setDownloading(id);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API}/api/requests/attachment/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const { url } = await res.json();
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.target = "_blank";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } finally { setDownloading(null); }
  };

  const toggleDetails = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const counts = {
    total:     myRequests.length,
    active:    myRequests.filter(r => !["Closed", "Rejected"].includes(r.status)).length,
    completed: myRequests.filter(r => r.status === "Closed").length,
    pending:   myRequests.filter(r => !r.ba_name && !r.ba_email).length,
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center gap-2 text-slate-400">
      <Loader2 className="size-4 animate-spin" /><span className="text-sm">Loading…</span>
    </div>
  );

  const rowProps = {
    expandedId,
    onToggleDetails: toggleDetails,
    onOpenDiscussion: (req: RequestItem) => openDiscussion(req, userId, userName),
    downloading,
    onDownload: downloadAttachment,
  };

  return (
    <div className="space-y-8">

        {/* Stats bar */}
        <div className="grid grid-cols-4 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
          {[
            { label: "Total",     value: counts.total,     color: "text-slate-800" },
            { label: "Active",    value: counts.active,    color: "text-indigo-600" },
            { label: "Completed", value: counts.completed, color: "text-emerald-600" },
            { label: "Unassigned",value: counts.pending,   color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="px-5 py-4">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className={`mt-0.5 text-xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* My Requests */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            My Requests ({myRequests.length})
          </h2>
          {myRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
              <FileText className="mb-3 size-8 text-slate-200" />
              <p className="text-sm font-medium text-slate-500">No requests yet</p>
              <p className="mt-1 text-xs text-slate-400">Submit a business problem to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myRequests.map(req => <RequestRow key={req.id} req={req} {...rowProps} />)}
            </div>
          )}
        </section>

        {/* Shared with you */}
        {sharedRequests.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Requests raised by other stakeholders
              </h2>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                Added by BA
              </span>
            </div>
            <div className="space-y-2">
              {sharedRequests.map(req => (
                <RequestRow key={req.id} req={req} {...rowProps} showSubmitter />
              ))}
            </div>
          </section>
        )}
    </div>
  );
}
