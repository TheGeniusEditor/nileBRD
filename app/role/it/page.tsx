"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { StakeholderRequest, getRequests } from "@/lib/workflow";

type ITStage =
  | "it_review"
  | "internal_feasibility"
  | "final_cost_approval"
  | "timeline_shared"
  | "ba_follow_up"
  | "sit"
  | "uat_delivery";

type ITWorkflowStatus = "not_started" | "in_progress" | "done";

type ITWorkflowState = {
  requestId: string;
  stages: Record<ITStage, ITWorkflowStatus>;
  timeline?: string;
  sitNotes?: string;
};

const IT_WORKFLOW_KEY = "itWorkflowState";

const workflowOrder: ITStage[] = [
  "it_review",
  "internal_feasibility",
  "final_cost_approval",
  "timeline_shared",
  "ba_follow_up",
  "sit",
  "uat_delivery",
];

const stageLabels: Record<ITStage, string> = {
  it_review: "Share to IT for Review & Feasibility",
  internal_feasibility: "Internal IT Feasibility (SPOC IT + IT Head Cost Approval)",
  final_cost_approval: "Final Cost Approval (Business Head + Project Head)",
  timeline_shared: "IT Team Shares Development Timelines",
  ba_follow_up: "BA Follow-up on Progress",
  sit: "IT SIT Execution",
  uat_delivery: "IT Delivery for UAT",
};

const stageDescriptions: Record<ITStage, string> = {
  it_review: "Triggered once stakeholder has approved the BRD.",
  internal_feasibility: "IT SPOC performs internal review and IT Head confirms estimated cost.",
  final_cost_approval: "Business Head and Project Head approve final project cost.",
  timeline_shared: "IT shares planned development start/end and key milestone dates.",
  ba_follow_up: "BA tracks progress and dependencies with IT delivery owners.",
  sit: "IT completes SIT and confirms readiness for business testing.",
  uat_delivery: "IT hands over build package/environment for UAT execution.",
};

const defaultWorkflowState = (requestId: string): ITWorkflowState => ({
  requestId,
  stages: {
    it_review: "in_progress",
    internal_feasibility: "not_started",
    final_cost_approval: "not_started",
    timeline_shared: "not_started",
    ba_follow_up: "not_started",
    sit: "not_started",
    uat_delivery: "not_started",
  },
  timeline: "",
  sitNotes: "",
});

const loadWorkflowMap = (): Record<string, ITWorkflowState> => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(IT_WORKFLOW_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as Record<string, ITWorkflowState>;
  } catch {
    return {};
  }
};

const saveWorkflowMap = (map: Record<string, ITWorkflowState>) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(IT_WORKFLOW_KEY, JSON.stringify(map));
};

const getStatusClass = (status: ITWorkflowStatus) => {
  if (status === "done") {
    return styles.done;
  }
  if (status === "in_progress") {
    return styles.inProgress;
  }
  return styles.notStarted;
};

export default function ItWorkspace() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [workflowMap, setWorkflowMap] = useState<Record<string, ITWorkflowState>>({});
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const allRequests = getRequests();
    const approvedRequests = allRequests.filter((item) => item.status === "approved");

    const storedMap = loadWorkflowMap();
    const nextMap = { ...storedMap };

    approvedRequests.forEach((item) => {
      if (!nextMap[item.id]) {
        nextMap[item.id] = defaultWorkflowState(item.id);
      }
    });

    setRequests(approvedRequests);
    setWorkflowMap(nextMap);
    saveWorkflowMap(nextMap);

    if (approvedRequests.length > 0) {
      setSelectedId(approvedRequests[0].id);
    }
  }, []);

  const selected = useMemo(
    () => requests.find((request) => request.id === selectedId),
    [requests, selectedId]
  );

  const selectedWorkflow = selectedId ? workflowMap[selectedId] : undefined;

  const completedCount = useMemo(() => {
    return Object.values(workflowMap).reduce((total, workflow) => {
      const doneInRequest = workflowOrder.filter((stage) => workflow.stages[stage] === "done").length;
      return total + doneInRequest;
    }, 0);
  }, [workflowMap]);

  const totalStageCount = requests.length * workflowOrder.length;

  const updateStage = (requestId: string, stage: ITStage, status: ITWorkflowStatus) => {
    setWorkflowMap((prev) => {
      const current = prev[requestId] || defaultWorkflowState(requestId);
      const updated: ITWorkflowState = {
        ...current,
        stages: {
          ...current.stages,
          [stage]: status,
        },
      };

      const next = {
        ...prev,
        [requestId]: updated,
      };

      saveWorkflowMap(next);
      return next;
    });
  };

  const updateField = (requestId: string, field: "timeline" | "sitNotes", value: string) => {
    setWorkflowMap((prev) => {
      const current = prev[requestId] || defaultWorkflowState(requestId);
      const updated: ITWorkflowState = {
        ...current,
        [field]: value,
      };

      const next = {
        ...prev,
        [requestId]: updated,
      };

      saveWorkflowMap(next);
      return next;
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role" className={styles.backLink}>
            ← Back to Roles
          </Link>
          <h1 className={styles.title}>IT Portal</h1>
          <p className={styles.subtitle}>
            Workflow starts after stakeholder approves BRD and tracks IT review through UAT handover.
          </p>
        </div>
        <Link href="/" className={styles.ctaLink}>
          Logout
        </Link>
      </header>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <h3>Approved BRDs</h3>
          <p>{requests.length}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Workflow Stages Done</h3>
          <p>{completedCount}</p>
        </article>
        <article className={styles.statCard}>
          <h3>Total Stages</h3>
          <p>{totalStageCount}</p>
        </article>
        <article className={styles.statCard}>
          <h3>In Progress Items</h3>
          <p>
            {
              Object.values(workflowMap).filter((workflow) =>
                workflowOrder.some((stage) => workflow.stages[stage] === "in_progress")
              ).length
            }
          </p>
        </article>
      </section>

      <div className={styles.layout}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Approved BRD Queue</h2>
            <span className={styles.badge}>{requests.length} items</span>
          </div>
          <div className={styles.cardBody}>
            {requests.length === 0 ? (
              <p className={styles.muted}>No stakeholder-approved BRDs available for IT workflow yet.</p>
            ) : (
              <div className={styles.queueList}>
                {requests.map((request) => (
                  <button
                    key={request.id}
                    className={`${styles.queueItem} ${selectedId === request.id ? styles.activeQueue : ""}`}
                    onClick={() => setSelectedId(request.id)}
                  >
                    <strong>{request.reqTitle}</strong>
                    <span>Owner: {request.owner}</span>
                    <span>Priority: {request.priority}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>IT Execution Workflow</h2>
            <span className={styles.badge}>7 Stages</span>
          </div>
          <div className={styles.cardBody}>
            {!selected || !selectedWorkflow ? (
              <p className={styles.muted}>Select an approved BRD to manage IT workflow stages.</p>
            ) : (
              <>
                <div className={styles.requestMeta}>
                  <h3>{selected.reqTitle}</h3>
                  <p>
                    Stakeholder approval completed. Continue IT execution from feasibility to UAT delivery.
                  </p>
                </div>

                <div className={styles.stageList}>
                  {workflowOrder.map((stage, index) => {
                    const status = selectedWorkflow.stages[stage];
                    return (
                      <article key={stage} className={styles.stageCard}>
                        <div className={styles.stageHeader}>
                          <div>
                            <h4>
                              Stage {index + 1}: {stageLabels[stage]}
                            </h4>
                            <p>{stageDescriptions[stage]}</p>
                          </div>
                          <span className={`${styles.statusPill} ${getStatusClass(status)}`}>
                            {status.replace("_", " ")}
                          </span>
                        </div>

                        <div className={styles.stageActions}>
                          <button
                            className={styles.secondaryBtn}
                            onClick={() => updateStage(selected.id, stage, "not_started")}
                          >
                            Mark Not Started
                          </button>
                          <button
                            className={styles.secondaryBtn}
                            onClick={() => updateStage(selected.id, stage, "in_progress")}
                          >
                            Mark In Progress
                          </button>
                          <button
                            className={styles.primaryBtn}
                            onClick={() => updateStage(selected.id, stage, "done")}
                          >
                            Mark Done
                          </button>
                        </div>

                        {stage === "timeline_shared" && (
                          <label className={styles.fullWidthLabel}>
                            Development Timelines
                            <textarea
                              rows={3}
                              value={selectedWorkflow.timeline || ""}
                              onChange={(event) =>
                                updateField(selected.id, "timeline", event.target.value)
                              }
                              placeholder="Sprint plan, milestone dates, deployment target"
                            />
                          </label>
                        )}

                        {stage === "sit" && (
                          <label className={styles.fullWidthLabel}>
                            SIT Notes
                            <textarea
                              rows={3}
                              value={selectedWorkflow.sitNotes || ""}
                              onChange={(event) =>
                                updateField(selected.id, "sitNotes", event.target.value)
                              }
                              placeholder="SIT findings, defect summary, sign-off notes"
                            />
                          </label>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
