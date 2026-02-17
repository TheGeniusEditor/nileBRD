"use client";

import Link from "next/link";
import styles from "../styles.module.css";
import approvalStyles from "./approvals.module.css";

type ApprovalRecord = {
  id: string;
  brdName: string;
  sentDate: string;
  stakeholder: string;
  role: string;
  status: "pending" | "approved" | "rejected" | "commented";
  dueDate: string;
  feedback?: string;
};

const mockApprovals: ApprovalRecord[] = [
  {
    id: "1",
    brdName: "Renewal Automation - Phase 1",
    sentDate: "2024-02-15",
    stakeholder: "John Smith",
    role: "Business Lead",
    status: "approved",
    dueDate: "2024-02-22",
    feedback: "Looks good. Approved for IT review.",
  },
  {
    id: "2",
    brdName: "Renewal Automation - Phase 1",
    sentDate: "2024-02-15",
    stakeholder: "Sarah Johnson",
    role: "Risk Manager",
    status: "approved",
    dueDate: "2024-02-22",
  },
  {
    id: "3",
    brdName: "Renewal Automation - Phase 1",
    sentDate: "2024-02-15",
    stakeholder: "Mike Chen",
    role: "Compliance Officer",
    status: "commented",
    dueDate: "2024-02-22",
    feedback: "Need more details on audit trail requirements.",
  },
  {
    id: "4",
    brdName: "Renewal Automation - Phase 1",
    sentDate: "2024-02-15",
    stakeholder: "Emma Wilson",
    role: "Ops Manager",
    status: "pending",
    dueDate: "2024-02-22",
  },
  {
    id: "5",
    brdName: "Customer Data Enhancement",
    sentDate: "2024-02-12",
    stakeholder: "David Brown",
    role: "IT Head",
    status: "approved",
    dueDate: "2024-02-19",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return { bg: "#d1fae5", text: "#047857", icon: "✓" };
    case "pending":
      return { bg: "#fef3c7", text: "#b45309", icon: "⏱" };
    case "rejected":
      return { bg: "#fee2e2", text: "#991b1b", icon: "✗" };
    case "commented":
      return { bg: "#dbeafe", text: "#0369a1", icon: "💬" };
    default:
      return { bg: "#f3f4f6", text: "#374151", icon: "?" };
  }
};

const getStatusProgressValue = (status: string) => {
  switch (status) {
    case "approved":
      return 100;
    case "rejected":
      return 0;
    case "commented":
      return 50;
    case "pending":
      return 25;
    default:
      return 0;
  }
};

export default function ApprovalsPage() {
  // Group by BRD
  const brdGroups = mockApprovals.reduce(
    (groups, approval) => {
      const key = approval.brdName;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(approval);
      return groups;
    },
    {} as Record<string, ApprovalRecord[]>
  );

  const calculateApprovalPercentage = (approvals: ApprovalRecord[]) => {
    const approved = approvals.filter((a) => a.status === "approved").length;
    return Math.round((approved / approvals.length) * 100);
  };

  return (
    <div className={styles.container}>
      <header className={approvalStyles.header}>
        <div>
          <Link href="/ba-portal" className={approvalStyles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1>Approval Tracking</h1>
          <p>Monitor stakeholder reviews and approvals for all BRDs</p>
        </div>
      </header>

      {Object.entries(brdGroups).map(([brdName, approvals]) => {
        const approvalPercentage = calculateApprovalPercentage(approvals);
        return (
          <div key={brdName} className={approvalStyles.brdSection}>
            <div className={approvalStyles.brdHeader}>
              <div>
                <h2>{brdName}</h2>
                <p>{approvals.length} stakeholders reviewing</p>
              </div>
              <div className={approvalStyles.progressContainer}>
                <div className={approvalStyles.progressBar}>
                  <div
                    className={approvalStyles.progressFill}
                    style={{ width: `${approvalPercentage}%` }}
                  />
                </div>
                <div className={approvalStyles.progressText}>
                  {approvalPercentage}% Complete
                </div>
              </div>
            </div>

            <div className={approvalStyles.approvalsGrid}>
              {approvals.map((approval) => {
                const statusColor = getStatusColor(approval.status);
                const statusProgress = getStatusProgressValue(approval.status);

                return (
                  <div key={approval.id} className={approvalStyles.approvalCard}>
                    <div className={approvalStyles.cardHeader}>
                      <div className={approvalStyles.stakeholderInfo}>
                        <div className={approvalStyles.name}>{approval.stakeholder}</div>
                        <div className={approvalStyles.role}>{approval.role}</div>
                      </div>
                      <span
                        className={approvalStyles.statusBadge}
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {statusColor.icon}{" "}
                        {approval.status.charAt(0).toUpperCase() +
                          approval.status.slice(1)}
                      </span>
                    </div>

                    <div className={approvalStyles.dueDate}>
                      Due: {approval.dueDate}
                    </div>

                    {approval.feedback && (
                      <div className={approvalStyles.feedback}>
                        <strong>Feedback:</strong>
                        <p>{approval.feedback}</p>
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
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.keys(brdGroups).length === 0 && (
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
              {mockApprovals.filter((a) => a.status === "pending").length}
            </div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Approved</div>
            <div className={approvalStyles.statValue}>
              {mockApprovals.filter((a) => a.status === "approved").length}
            </div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Pending Feedback</div>
            <div className={approvalStyles.statValue}>
              {mockApprovals.filter((a) => a.status === "commented").length}
            </div>
          </div>
          <div className={approvalStyles.statBox}>
            <div className={approvalStyles.statLabel}>Total</div>
            <div className={approvalStyles.statValue}>
              {mockApprovals.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
