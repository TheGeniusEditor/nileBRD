"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "../styles.module.css";
import approvalStyles from "./approvals.module.css";
import {
  ITStage,
  ITWorkflowState,
  StakeholderRequest,
  getRequests,
  loadFeasibilityMap,
  loadITWorkflowMap,
} from "@/lib/workflow";

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
  it_review: "IT Review",
  internal_feasibility: "Internal Feasibility",
  final_cost_approval: "Final Cost Approval",
  timeline_shared: "Timeline Shared",
  ba_follow_up: "BA Follow-up",
  sit: "SIT",
  uat_delivery: "UAT Delivery",
};

const getStatusColor = (status: StakeholderRequest["status"]) => {
  switch (status) {
    case "approved":
      return { bg: "#d1fae5", text: "#047857", icon: "✓" };
    case "sent":
      return { bg: "#fef3c7", text: "#b45309", icon: "⏱" };
    case "changes_requested":
      return { bg: "#dbeafe", text: "#0369a1", icon: "💬" };
    default:
      return { bg: "#f3f4f6", text: "#374151", icon: "?" };
  }
};

const getStatusProgressValue = (status: StakeholderRequest["status"]) => {
  switch (status) {
    case "approved":
      return 100;
    case "changes_requested":
      return 50;
    case "sent":
      return 25;
    default:
      return 0;
  }
};

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<StakeholderRequest[]>([]);
  const [workflowMap, setWorkflowMap] = useState<Record<string, ITWorkflowState>>({});
  const [feasibilityMap, setFeasibilityMap] = useState(loadFeasibilityMap());

  useEffect(() => {
    const all = getRequests();
    const reviewItems = all.filter(
      (item) =>
        item.createdBy !== "ba" &&
        (item.status === "sent" || item.status === "approved" || item.status === "changes_requested")
    );
    setRequests(reviewItems);
    setWorkflowMap(loadITWorkflowMap());
    setFeasibilityMap(loadFeasibilityMap());
  }, []);

  const itSummary = useMemo(() => {
    const workflows = requests
      .filter((request) => request.status === "approved")
      .map((request) => workflowMap[request.id])
      .filter((workflow): workflow is ITWorkflowState => Boolean(workflow));

    const inProgress = workflows.filter((workflow) =>
      workflowOrder.some((stage) => workflow.stages[stage] === "in_progress")
    ).length;

    const delivered = workflows.filter(
      (workflow) => workflow.stages.uat_delivery === "done"
    ).length;

    return { inProgress, delivered };
  }, [requests, workflowMap]);

  return (
    <div className={styles.container}>
      <header className={approvalStyles.header}>
        <div>
          <Link href="/ba-portal" className={approvalStyles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1>Approval Tracking</h1>
          <p>Monitor stakeholder approvals and IT execution progress for all BRDs</p>
        </div>
      </header>

      {requests.map((request) => {
        const statusColor = getStatusColor(request.status);
        const statusProgress = getStatusProgressValue(request.status);
        const itWorkflow = workflowMap[request.id];
        const feasibility = feasibilityMap[request.id];
        const completedStages = itWorkflow
          ? workflowOrder.filter((stage) => itWorkflow.stages[stage] === "done").length
          : 0;
        const currentStage = itWorkflow
          ? workflowOrder.find((stage) => itWorkflow.stages[stage] === "in_progress") ||
            (itWorkflow.stages.uat_delivery === "done" ? "uat_delivery" : undefined)
          : undefined;
        const itProgress = Math.round((completedStages / workflowOrder.length) * 100);
        const latestITUpdate = [...(request.threads || [])]
          .reverse()
          .find((thread) => (thread.participants || "").toLowerCase().includes("it"));
        const showITCard = request.status === "approved" || request.status === "changes_requested" || Boolean(itWorkflow) || Boolean(feasibility);

        return (
          <div key={request.id} className={approvalStyles.brdSection}>
            <div className={approvalStyles.brdHeader}>
              <div>
                <h2>{request.reqTitle}</h2>
                <p>Owner: {request.owner || "Stakeholder Team"}</p>
              </div>
              <div className={approvalStyles.progressContainer}>
                <div className={approvalStyles.progressBar}>
                  <div
                    className={approvalStyles.progressFill}
                    style={{ width: `${statusProgress}%` }}
                  />
                </div>
                <div className={approvalStyles.progressText}>
                  Approval: {statusProgress}%
                </div>
              </div>
            </div>

            <div className={approvalStyles.approvalsGrid}>
              <div className={approvalStyles.approvalCard}>
                <div className={approvalStyles.cardHeader}>
                  <div className={approvalStyles.stakeholderInfo}>
                    <div className={approvalStyles.name}>{request.owner || "Stakeholder Team"}</div>
                    <div className={approvalStyles.role}>Stakeholder Approval</div>
                  </div>
                  <span
                    className={approvalStyles.statusBadge}
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                    }}
                  >
                    {statusColor.icon} {request.status.replace("_", " ")}
                  </span>
                </div>

                <div className={approvalStyles.dueDate}>
                  Sent: {request.sentAt || "Not sent yet"}
                </div>

                {request.reviewerComment && (
                  <div className={approvalStyles.feedback}>
                    <strong>Feedback:</strong>
                    <p>{request.reviewerComment}</p>
                  </div>
                )}

                <div className={approvalStyles.miniProgress}>
                  <div
                    className={approvalStyles.miniProgressBar}
                    style={{
                      width: `${statusProgress}%`,
                      backgroundColor: statusColor.text,
                    }}
                  />
                </div>
              </div>

              {showITCard && (
                <div className={approvalStyles.itCard}>
                  <div className={approvalStyles.cardHeader}>
                    <div className={approvalStyles.stakeholderInfo}>
                      <div className={approvalStyles.name}>IT Workflow</div>
                      <div className={approvalStyles.role}>Post-approval execution</div>
                    </div>
                    <span className={approvalStyles.itBadge}>{itProgress}%</span>
                  </div>

                  {!itWorkflow && !feasibility ? (
                    <p className={approvalStyles.itMuted}>IT workflow not started yet by IT portal.</p>
                  ) : (
                    <>
                      {feasibility && (
                        <div className={approvalStyles.itMeta}>
                          <span>Feasibility: {feasibility.status.replace("_", " ")}</span>
                          <span>{feasibility.updatedAt || "Awaiting update"}</span>
                        </div>
                      )}

                      <div className={approvalStyles.itMeta}>
                        <span>
                          Current Stage: {currentStage ? stageLabels[currentStage] : "Not started"}
                        </span>
                        <span>
                          Done: {completedStages}/{workflowOrder.length}
                        </span>
                      </div>
                      <div className={approvalStyles.miniProgress}>
                        <div
                          className={approvalStyles.miniProgressBar}
                          style={{ width: `${itProgress}%`, backgroundColor: "#0f766e" }}
                        />
                      </div>

                      {itWorkflow.timeline && (
                        <div className={approvalStyles.feedback}>
                          <strong>Development Timeline</strong>
                          <p>{itWorkflow.timeline}</p>
                        </div>
                      )}

                      {request.status === "changes_requested" && (
                        <div className={approvalStyles.feedback}>
                          <strong>Returned to BA</strong>
                          <p>
                            {request.reviewerComment ||
                              "IT marked this BRD as not feasible and sent it back for BA updates."}
                          </p>
                        </div>
                      )}

                      {latestITUpdate && (
                        <div className={approvalStyles.feedback}>
                          <strong>Latest IT Update</strong>
                          <p>{latestITUpdate.notes || latestITUpdate.transcript || "No details shared."}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {requests.length === 0 && (
        <div className={approvalStyles.empty}>
          <div className={approvalStyles.emptyIcon}>📋</div>
          <h3>No BRDs sent for approval yet</h3>
          <p>Create and send a BRD to start tracking approvals</p>
          <Link href="/ba-portal" className={approvalStyles.backLink}>
            → Go to Dashboard
          </Link>
        </div>
      )}

      {/* Summary Stats */}
      <div className={approvalStyles.summarySection}>
        <h2>Summary</h2>
        <div className={approvalStyles.statsGrid}>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Total Approvals Pending</div>
            <div className={approvalStyles.statValue}>
              {requests.filter((item) => item.status === "sent").length}
            </div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Approved</div>
            <div className={approvalStyles.statValue}>
              {requests.filter((item) => item.status === "approved").length}
            </div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Pending Feedback</div>
            <div className={approvalStyles.statValue}>
              {requests.filter((item) => item.status === "changes_requested").length}
            </div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>IT In Progress</div>
            <div className={approvalStyles.statValue}>{itSummary.inProgress}</div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Delivered for UAT</div>
            <div className={approvalStyles.statValue}>{itSummary.delivered}</div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Total</div>
            <div className={approvalStyles.statValue}>
              {requests.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
