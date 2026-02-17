"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./preview.module.css";
import {
  BRDMasterData,
  StakeholderRequest,
  defaultBRDMasterFromRequest,
  getRequests,
} from "@/lib/workflow";

export default function BRDPreviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = params?.id;

  const [request, setRequest] = useState<StakeholderRequest | null>(null);
  const [master, setMaster] = useState<BRDMasterData | null>(null);

  useEffect(() => {
    const all = getRequests();
    const found = all.find((item) => item.id === requestId) || null;
    setRequest(found);
    if (found) {
      setMaster({
        ...defaultBRDMasterFromRequest(found),
        ...(found.brdMaster ?? {}),
      });
    }
  }, [requestId]);

  const canSend = useMemo(() => Boolean(request && master), [request, master]);

  const sendToStakeholders = () => {
    if (!request || !master) {
      return;
    }

    window.localStorage.setItem(
      "sendRequestContext",
      JSON.stringify({
        requestId: request.id,
        reqTitle: request.reqTitle,
        brdMaster: master,
      })
    );
    router.push("/ba-portal/send");
  };

  if (!request || !master) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCard}>
          <h1>BRD preview not found</h1>
          <p>The request may not exist or has no BRD data yet.</p>
          <Link href="/ba-portal/requests" className={styles.backBtn}>
            Back to Requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/ba-portal/requests" className={styles.backLink}>
            ← Back to Requests
          </Link>
          <h1>BRD Preview</h1>
          <p>{request.reqTitle}</p>
        </div>
        <button className={styles.sendBtn} onClick={sendToStakeholders} disabled={!canSend}>
          Send to Stakeholders
        </button>
      </header>

      <div className={styles.doc}>
        <section className={styles.section}>
          <h2>1) Basics & Context</h2>
          <div className={styles.grid2}>
            <Field label="BRD Title" value={master.title} />
            <Field label="Business Unit / Function" value={master.bu} />
            <Field label="Domain" value={master.domain} />
            <Field label="Product" value={master.product} />
            <Field label="Priority" value={master.priority} />
            <Field label="Tags" value={master.tags} />
          </div>
          <Block label="Business Objective" value={master.objective} />
          <Block label="Success Metrics / KPIs" value={master.kpis} />
          <Block label="Assumptions" value={master.assumptions} />
          <Block label="Constraints" value={master.constraints} />
        </section>

        <section className={styles.section}>
          <h2>2) Scope & Boundaries</h2>
          <Block label="Scope In" value={master.scopeIn} />
          <Block label="Scope Out" value={master.scopeOut} />
          <div className={styles.grid2}>
            <Field label="Channels" value={master.channels} />
            <Field label="Personas" value={master.personas} />
          </div>
          <Block label="Business Process Narrative" value={master.process} />
        </section>

        <section className={styles.section}>
          <h2>3) Data, Reporting & Regulatory</h2>
          <Block label="Upstream Data Sources" value={master.sources} />
          <Block label="Downstream Consumers" value={master.consumers} />
          <div className={styles.grid3}>
            <Field label="Retention (years)" value={master.retentionYears} />
            <Field label="Audit required" value={master.auditRequired} />
            <Field label="PII class" value={master.piiClass} />
          </div>
          <Block label="Regulatory Mapping" value={master.regMap} />
          <Block label="Reporting / MIS Needs" value={master.mis} />
        </section>

        <section className={styles.section}>
          <h2>4) NFR Baseline</h2>
          <div className={styles.grid3}>
            <Field label="Peak TPS / Concurrency" value={master.tps} />
            <Field label="Latency target" value={master.latency} />
            <Field label="Availability" value={master.availability} />
            <Field label="RPO" value={master.rpo} />
            <Field label="RTO" value={master.rto} />
            <Field label="AuthN/AuthZ" value={master.auth} />
          </div>
          <Block label="Security Controls" value={master.securityControls} />
          <Block label="Observability" value={master.observability} />
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value || "—"}</div>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.block}>
      <div className={styles.label}>{label}</div>
      <pre className={styles.pre}>{value || "—"}</pre>
    </div>
  );
}
