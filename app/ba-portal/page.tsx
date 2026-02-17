"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

type BRDProject = {
  id: string;
  name: string;
  status: "draft" | "generated" | "sent" | "approved";
  createdAt: string;
  lastModified: string;
  description: string;
};

const mockProjects: BRDProject[] = [
  {
    id: "1",
    name: "Renewal Automation - Phase 1",
    status: "sent",
    createdAt: "2024-02-10",
    lastModified: "2024-02-15",
    description: "Streamline renewal workflow with automated eligibility checks",
  },
  {
    id: "2",
    name: "Customer Data Enhancement",
    status: "generated",
    createdAt: "2024-02-05",
    lastModified: "2024-02-12",
    description: "Improve data quality and validation mechanisms",
  },
  {
    id: "3",
    name: "Risk Scoring Module",
    status: "draft",
    createdAt: "2024-01-28",
    lastModified: "2024-02-01",
    description: "Implement dynamic risk assessment model",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return { bg: "#fef3c7", text: "#b45309" };
    case "generated":
      return { bg: "#dbeafe", text: "#0369a1" };
    case "sent":
      return { bg: "#d1fae5", text: "#047857" };
    case "approved":
      return { bg: "#c7d2fe", text: "#3f51b5" };
    default:
      return { bg: "#f3f4f6", text: "#374151" };
  }
};

export default function BAPortalDashboard() {
  const [projects] = useState<BRDProject[]>(mockProjects);

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>BA Portal</h1>
          <p className={styles.subtitle}>
            Manage BRD generation, reviews, and stakeholder approvals
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/ba-portal/requests" className={styles.primaryBtn}>
            + New BRD
          </Link>
          <Link href="/" className={styles.logoutBtn}>
            Logout
          </Link>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Projects</div>
          <div className={styles.statValue}>{projects.length}</div>
          <div className={styles.statCompare}>
            In various stages of completion
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Pending Approval</div>
          <div className={styles.statValue}>
            {projects.filter((p) => p.status === "sent").length}
          </div>
          <div className={styles.statCompare}>
            Waiting for stakeholder review
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Draft</div>
          <div className={styles.statValue}>
            {projects.filter((p) => p.status === "draft").length}
          </div>
          <div className={styles.statCompare}>Ready for generation</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Approved</div>
          <div className={styles.statValue}>
            {projects.filter((p) => p.status === "approved").length}
          </div>
          <div className={styles.statCompare}>Ready for IT review</div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link href="/ba-portal/requests" className={styles.actionCard}>
            <div className={styles.actionIcon}>📝</div>
            <h3>Start from Stakeholder Request</h3>
            <p>Pick an intake request created by stakeholders and begin BRD drafting</p>
          </Link>
          <Link href="/ba-portal/requests" className={styles.actionCard}>
            <div className={styles.actionIcon}>📋</div>
            <h3>View All Requests</h3>
            <p>See all created requests and generate BRDs with AI</p>
          </Link>
          <Link href="/ba-portal/send" className={styles.actionCard}>
            <div className={styles.actionIcon}>📤</div>
            <h3>Send to Stakeholders</h3>
            <p>Roll out BRD to stakeholders for review and approval</p>
          </Link>
          <Link href="/ba-portal/approvals" className={styles.actionCard}>
            <div className={styles.actionIcon}>✓</div>
            <h3>Track Approvals</h3>
            <p>Monitor stakeholder approvals and feedback</p>
          </Link>
        </div>
      </section>

      {/* Recent Projects */}
      <section className={styles.recentProjects}>
        <h2 className={styles.sectionTitle}>Recent Projects</h2>
        <div className={styles.projectsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.colName}>Project Name</div>
            <div className={styles.colStatus}>Status</div>
            <div className={styles.colDate}>Last Modified</div>
            <div className={styles.colActions}>Actions</div>
          </div>
          {projects.map((project) => {
            const statusColor = getStatusColor(project.status);
            return (
              <div key={project.id} className={styles.tableRow}>
                <div className={styles.colName}>
                  <Link href={`/ba-portal/brd/${project.id}`}>
                    <div className={styles.projectTitle}>{project.name}</div>
                    <div className={styles.projectDesc}>
                      {project.description}
                    </div>
                  </Link>
                </div>
                <div className={styles.colStatus}>
                  <span
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                    }}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </span>
                </div>
                <div className={styles.colDate}>{project.lastModified}</div>
                <div className={styles.colActions}>
                  <Link
                    href={`/ba-portal/brd/${project.id}`}
                    className={styles.actionLink}
                  >
                    View
                  </Link>
                  {project.status === "generated" && (
                    <Link
                      href={`/ba-portal/send/${project.id}`}
                      className={styles.actionLink}
                    >
                      Send
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Overview */}
      <section className={styles.processOverview}>
        <h2 className={styles.sectionTitle}>BA Workflow</h2>
        <div className={styles.processFlow}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h3>Intake</h3>
              <p>Stakeholder logs request details and thread history</p>
            </div>
          </div>
          <div className={styles.connector}>→</div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h3>Generate BRD</h3>
              <p>Create BRD using AI or manual drafting</p>
            </div>
          </div>
          <div className={styles.connector}>→</div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h3>Send & Review</h3>
              <p>Roll out BRD to stakeholders</p>
            </div>
          </div>
          <div className={styles.connector}>→</div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>4</div>
            <div className={styles.stepContent}>
              <h3>Approvals</h3>
              <p>Collect stakeholder sign-offs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
