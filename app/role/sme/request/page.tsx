"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./request.module.css";
import { createStakeholderRequest, getRequests, saveRequests } from "@/lib/workflow";

export default function StakeholderRequestPage() {
  const [formData, setFormData] = useState({
    reqType: "BRD",
    reqTitle: "",
    owner: "SME Team",
    tenant: "BANK",
    priority: "P2",
    brief: "",
  });

  const submitRequest = () => {
    if (!formData.reqTitle || !formData.brief) {
      window.alert("Please fill request title and brief");
      return;
    }

    const payload = createStakeholderRequest({
      ...formData,
      threads: [],
    });

    const existing = getRequests();
    saveRequests([payload, ...existing]);

    setFormData({
      reqType: "BRD",
      reqTitle: "",
      owner: "SME Team",
      tenant: "BANK",
      priority: "P2",
      brief: "",
    });

    window.alert("Request submitted to BA successfully.");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/role/sme" className={styles.backLink}>
            ← Back to Stakeholder Portal
          </Link>
          <h1>Create Request</h1>
          <p>Provide request input details for BA.</p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.formGrid}>
          <label>
            Request Type
            <select
              value={formData.reqType}
              onChange={(event) => setFormData((prev) => ({ ...prev, reqType: event.target.value }))}
            >
              <option value="BRD">BRD</option>
              <option value="CR">Change Request</option>
            </select>
          </label>

          <label>
            Priority
            <select
              value={formData.priority}
              onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
            >
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </label>

          <label className={styles.full}>
            Request Title
            <input
              value={formData.reqTitle}
              onChange={(event) => setFormData((prev) => ({ ...prev, reqTitle: event.target.value }))}
              placeholder="Digital lending policy update"
            />
          </label>

          <label>
            Owner
            <input
              value={formData.owner}
              onChange={(event) => setFormData((prev) => ({ ...prev, owner: event.target.value }))}
              placeholder="Business Owner"
            />
          </label>

          <label>
            Tenant
            <select
              value={formData.tenant}
              onChange={(event) => setFormData((prev) => ({ ...prev, tenant: event.target.value }))}
            >
              <option value="BANK">BANK</option>
              <option value="NBFC">NBFC</option>
              <option value="BOTH">BOTH</option>
            </select>
          </label>

          <label className={styles.full}>
            Initial Brief
            <textarea
              rows={6}
              value={formData.brief}
              onChange={(event) => setFormData((prev) => ({ ...prev, brief: event.target.value }))}
              placeholder="Provide business objective, scope and expected outcome"
            />
          </label>
        </div>

        <button className={styles.primaryBtn} onClick={submitRequest}>
          Submit Request
        </button>
      </section>
    </div>
  );
}
