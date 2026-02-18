"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./preview.module.css";
import {
  BRDMasterData,
  StakeholderRequest,
  buildPHLTemplateBRD,
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
  const templatePreview = useMemo(() => {
    if (!request || !master) {
      return "";
    }

    return buildPHLTemplateBRD(request, master);
  }, [request, master]);

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
          <h2>Template-aligned BRD Preview</h2>
          <pre className={styles.pre}>{templatePreview}</pre>
        </section>
      </div>
    </div>
  );
}
