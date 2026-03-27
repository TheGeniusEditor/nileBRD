"use client";

import { useState, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Flame,
  Paperclip,
  Send,
  Sparkles,
  Tag,
  TrendingUp,
  Upload,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Priority = "Low" | "Medium" | "High" | "Critical";
type Category = "Process Improvement" | "System Issue" | "New Feature" | "Compliance" | "Cost Reduction" | "Other";

type Problem = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  attachments: string[];
  submittedAt: Date;
};

const priorityConfig: Record<Priority, { color: string; bg: string; border: string; icon: React.ReactNode; glow: string }> = {
  Low: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <TrendingUp className="size-3.5" />,
    glow: "shadow-emerald-100",
  },
  Medium: {
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Clock className="size-3.5" />,
    glow: "shadow-amber-100",
  },
  High: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: <Zap className="size-3.5" />,
    glow: "shadow-orange-100",
  },
  Critical: {
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    icon: <Flame className="size-3.5" />,
    glow: "shadow-rose-100",
  },
};

const categoryConfig: Record<Category, { emoji: string; description: string }> = {
  "Process Improvement": { emoji: "⚙️", description: "Streamline workflows and operations" },
  "System Issue": { emoji: "🔧", description: "Technical bugs or system failures" },
  "New Feature": { emoji: "✨", description: "Request new capabilities or tools" },
  Compliance: { emoji: "🛡️", description: "Regulatory or policy requirements" },
  "Cost Reduction": { emoji: "💰", description: "Reduce expenses or optimize spend" },
  Other: { emoji: "📋", description: "Other business needs" },
};

const steps = ["Details", "Category & Priority", "Attachments", "Review"];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
              i < current
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : i === current
                ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-lg shadow-blue-200"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {i < current ? <CheckCircle2 className="size-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-0.5 w-10 transition-all duration-700 ${i < current ? "bg-blue-600" : "bg-slate-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const pct = (value.length / max) * 100;
  const color = pct > 90 ? "text-rose-500" : pct > 70 ? "text-amber-500" : "text-slate-400";
  return (
    <span className={`text-xs transition-colors duration-300 ${color}`}>
      {value.length}/{max}
    </span>
  );
}

function SubmissionCard({ item, index }: { item: Problem; index: number }) {
  const p = priorityConfig[item.priority];
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800">{item.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{item.description}</p>
        </div>
        <div className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${p.color} ${p.bg} ${p.border}`}>
          {p.icon}
          {item.priority}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
          {categoryConfig[item.category].emoji} {item.category}
        </span>
        <span className="text-xs text-slate-400">
          {item.submittedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        {item.attachments.length > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-slate-400">
            <Paperclip className="size-3" />
            {item.attachments.length}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SubmitProblemPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<Problem[]>([]);
  const [attachmentInput, setAttachmentInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<Problem, "id" | "submittedAt">>({
    title: "",
    description: "",
    priority: "Medium",
    category: "Process Improvement",
    attachments: [],
  });

  const canProceed = [
    form.title.trim().length >= 5 && form.description.trim().length >= 20,
    true,
    true,
    true,
  ];

  const addAttachment = () => {
    if (!attachmentInput.trim()) return;
    setForm((p) => ({ ...p, attachments: [...p.attachments, attachmentInput.trim()] }));
    setAttachmentInput("");
  };

  const removeAttachment = (idx: number) => {
    setForm((p) => ({ ...p, attachments: p.attachments.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setItems((prev) => [
        {
          ...form,
          id: `REQ-${1100 + prev.length + 1}`,
          submittedAt: new Date(),
        },
        ...prev,
      ]);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 1800);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", priority: "Medium", category: "Process Improvement", attachments: [] });
    setStep(0);
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-7 text-white shadow-xl shadow-blue-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
        <div className="absolute -right-8 -top-8 size-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 size-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <FileText className="size-5" />
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                Business Problem Submission
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Submit a Business Request</h1>
            <p className="mt-1 text-sm text-blue-100">
              Describe your problem clearly — our BA team will review and assign it.
            </p>
          </div>
          <div className="hidden flex-col items-end gap-1 text-right md:flex">
            <span className="text-xs text-blue-200">Total Submitted</span>
            <span className="text-4xl font-bold tabular-nums">{items.length}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr,1fr]">
        {/* Form card */}
        <Card className="overflow-hidden !p-0">
          {/* Step header */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
            <div className="flex items-center justify-between">
              <StepIndicator current={step} total={steps.length} />
              <span className="text-xs font-medium text-slate-500">Step {step + 1} of {steps.length}: {steps[step]}</span>
            </div>
          </div>

          <div className="p-6">
            {/* Success state */}
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="relative mb-5">
                  <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="size-10 text-emerald-500" />
                  </div>
                  <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Sparkles className="size-3.5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Submitted!</h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Your business problem has been logged as <span className="font-semibold text-blue-600">REQ-{1099 + items.length}</span>. A Business Analyst will be assigned shortly.
                </p>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-3">
                  <div className="text-left">
                    <p className="text-xs text-slate-500">Expected Response</p>
                    <p className="text-sm font-semibold text-slate-800">Within 2 business days</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-6" onClick={resetForm}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Step 0: Details */}
                {step === 0 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
                        <span className="flex items-center gap-1.5"><Tag className="size-3.5 text-blue-500" />Problem Title *</span>
                        <CharCounter value={form.title} max={80} />
                      </label>
                      <input
                        maxLength={80}
                        placeholder="e.g. Manual invoice processing causing delays"
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                      />
                      {form.title.trim().length > 0 && form.title.trim().length < 5 && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                          <AlertCircle className="size-3" /> Title must be at least 5 characters
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
                        <span className="flex items-center gap-1.5"><FileText className="size-3.5 text-blue-500" />Detailed Description *</span>
                        <CharCounter value={form.description} max={1000} />
                      </label>
                      <textarea
                        rows={6}
                        maxLength={1000}
                        placeholder="Describe the problem in detail. Include: what's happening, impact on operations, how often it occurs, and any workarounds currently in use..."
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                      />
                      {form.description.trim().length > 0 && form.description.trim().length < 20 && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                          <AlertCircle className="size-3" /> Please provide at least 20 characters
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 1: Category & Priority */}
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Request Category</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(Object.keys(categoryConfig) as Category[]).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setForm((p) => ({ ...p, category: cat }))}
                            className={`group relative rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                              form.category === cat
                                ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                                : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                            }`}
                          >
                            {form.category === cat && (
                              <div className="absolute right-2 top-2">
                                <CheckCircle2 className="size-4 text-blue-500" />
                              </div>
                            )}
                            <span className="text-lg">{categoryConfig[cat].emoji}</span>
                            <p className={`mt-1 text-xs font-semibold ${form.category === cat ? "text-blue-700" : "text-slate-700"}`}>
                              {cat}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 leading-tight">{categoryConfig[cat].description}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Priority Level</label>
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {(Object.keys(priorityConfig) as Priority[]).map((lvl) => {
                          const p = priorityConfig[lvl];
                          return (
                            <button
                              key={lvl}
                              onClick={() => setForm((f) => ({ ...f, priority: lvl }))}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 py-3 transition-all duration-200 ${
                                form.priority === lvl
                                  ? `${p.border} ${p.bg} shadow-md ${p.glow}`
                                  : "border-slate-200 bg-white hover:border-slate-300"
                              }`}
                            >
                              <span className={`flex size-8 items-center justify-center rounded-full ${form.priority === lvl ? p.bg : "bg-slate-100"}`}>
                                <span className={form.priority === lvl ? p.color : "text-slate-400"}>
                                  {p.icon}
                                </span>
                              </span>
                              <span className={`text-xs font-semibold ${form.priority === lvl ? p.color : "text-slate-600"}`}>
                                {lvl}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Attachments */}
                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-100">
                        <Upload className="size-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700">Drop files here or click to browse</p>
                        <p className="text-xs text-slate-500">PDF, DOCX, XLSX, PNG up to 10MB</p>
                      </div>
                      <input ref={fileInputRef} type="file" className="hidden" multiple />
                    </div>

                    <div className="flex gap-2">
                      <input
                        placeholder="Or type a filename manually..."
                        value={attachmentInput}
                        onChange={(e) => setAttachmentInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addAttachment()}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                      <Button variant="outline" size="sm" onClick={addAttachment}>
                        <Paperclip className="mr-1.5 size-3.5" /> Add
                      </Button>
                    </div>

                    {form.attachments.length > 0 && (
                      <div className="space-y-2">
                        {form.attachments.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50">
                                <Paperclip className="size-3.5 text-blue-500" />
                              </div>
                              <span className="text-sm text-slate-700">{file}</span>
                            </div>
                            <button onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-rose-500 transition-colors">
                              <X className="size-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {form.attachments.length === 0 && (
                      <p className="text-center text-xs text-slate-400">No attachments added — this step is optional</p>
                    )}
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 p-5 space-y-4">
                      <h3 className="font-semibold text-slate-800">Review Your Submission</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Title</p>
                          <p className="mt-0.5 text-sm font-semibold text-slate-800">{form.title}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Description</p>
                          <p className="mt-0.5 text-sm text-slate-700 leading-relaxed">{form.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Category</p>
                            <p className="mt-0.5 text-sm text-slate-700">
                              {categoryConfig[form.category].emoji} {form.category}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Priority</p>
                            <span className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityConfig[form.priority].color} ${priorityConfig[form.priority].bg} ${priorityConfig[form.priority].border}`}>
                              {priorityConfig[form.priority].icon} {form.priority}
                            </span>
                          </div>
                        </div>
                        {form.attachments.length > 0 && (
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Attachments ({form.attachments.length})</p>
                            <div className="mt-1 flex flex-wrap gap-1.5">
                              {form.attachments.map((f, i) => (
                                <span key={i} className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-600">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                      <AlertCircle className="size-4 shrink-0 text-amber-500 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        Once submitted, a Business Analyst will be assigned within 2 business days. You can track progress under <strong>My Requests</strong>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep((s) => s - 1)}
                    disabled={step === 0}
                    className="text-slate-500"
                  >
                    Back
                  </Button>

                  {step < steps.length - 1 ? (
                    <Button
                      variant="gradient-primary"
                      size="sm"
                      disabled={!canProceed[step]}
                      onClick={() => setStep((s) => s + 1)}
                    >
                      Continue <ArrowRight className="ml-1.5 size-3.5" />
                    </Button>
                  ) : (
                    <Button
                      variant="gradient-primary"
                      size="md"
                      isLoading={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {!isSubmitting && <Send className="mr-2 size-4" />}
                      Submit Request
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Sidebar: Recent submissions */}
        <div className="space-y-4">
          <Card className="!p-0 overflow-hidden">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Recent Submissions</h3>
                <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {items.length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                    <FileText className="size-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No submissions yet</p>
                  <p className="mt-1 text-xs text-slate-400">Your requests will appear here</p>
                </div>
              ) : (
                items.map((item, i) => <SubmissionCard key={item.id} item={item} index={i} />)
              )}
            </div>
          </Card>

          {/* Tips card */}
          <Card variant="gradient-subtle" className="!p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-4 text-blue-500" />
              <h4 className="text-sm font-semibold text-slate-700">Tips for a great submission</h4>
            </div>
            <ul className="space-y-2">
              {[
                "Be specific — avoid vague titles like 'System problem'",
                "Quantify the impact when possible (e.g. '3 hours lost daily')",
                "Attach screenshots or reports if available",
                "Set Critical priority only for urgent blockers",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-[10px]">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
