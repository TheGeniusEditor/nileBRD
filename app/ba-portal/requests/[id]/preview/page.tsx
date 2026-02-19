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
import { generatePHLBRDPdfBlob } from "@/lib/brdPdf";

export default function BRDPreviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const requestId = params?.id;

  const [request, setRequest] = useState<StakeholderRequest | null>(null);
  const [master, setMaster] = useState<BRDMasterData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

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

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const buildPdf = async () => {
      if (!request || !master) {
        setPdfUrl(null);
        return;
      }

      setIsPdfLoading(true);
      setPdfError(null);

      try {
        const blob = await generatePHLBRDPdfBlob(request, master);
        objectUrl = URL.createObjectURL(blob);
        if (!active) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setPdfUrl((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return objectUrl;
        });
      } catch {
        if (active) {
          setPdfError("Unable to generate BRD PDF preview.");
          setPdfUrl((prev) => {
            if (prev) {
              URL.revokeObjectURL(prev);
            }
            return null;
          });
        }
      } finally {
        if (active) {
          setIsPdfLoading(false);
        }
      }
    };

    buildPdf();

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
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
          <h2>Template-aligned BRD PDF Preview</h2>
          {isPdfLoading && <p className={styles.helper}>Generating BRD PDF...</p>}
          {pdfError && <p className={styles.error}>{pdfError}</p>}
          {pdfUrl && (
            <>
              <iframe src={pdfUrl} className={styles.pdfFrame} title="BRD PDF Preview" />
              <div className={styles.pdfActions}>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.openLink}>
                  Open PDF in new tab
                </a>
                <a href={pdfUrl} download={`${request.reqTitle || "BRD"}.pdf`} className={styles.openLink}>
                  Download PDF
                </a>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
