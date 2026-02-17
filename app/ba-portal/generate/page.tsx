"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";
import genStyles from "./generate.module.css";

type BRDInput = {
  problem: string;
  objectives: string;
  scopeIn: string;
  scopeOut: string;
  risks: string;
  dataRequired: string;
  assumptions: string;
  additionalNotes: string;
};

type BRDGenerated = BRDInput & {
  requirements: string;
  successCriteria: string;
  timeline: string;
};

const defaultInput: BRDInput = {
  problem: "",
  objectives: "",
  scopeIn: "",
  scopeOut: "",
  risks: "",
  dataRequired: "",
  assumptions: "",
  additionalNotes: "",
};

export default function GenerateBRDPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "generated">("input");
  const [input, setInput] = useState<BRDInput>(defaultInput);
  const [generated, setGenerated] = useState<BRDGenerated | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load intake data on mount
  useEffect(() => {
    const intakeData = localStorage.getItem("intakeData");
    if (intakeData) {
      const data = JSON.parse(intakeData);
      
      // Build additional notes from threads
      let threadsText = "";
      if (data.threads && data.threads.length > 0) {
        threadsText = "\n\n--- CONVERSATION THREADS ---\n";
        data.threads.forEach((thread: any, index: number) => {
          threadsText += `\nThread ${index + 1}: ${thread.title}\n`;
          threadsText += `Date: ${thread.date} ${thread.time || ""}\n`;
          if (thread.participants) threadsText += `Participants: ${thread.participants}\n`;
          if (thread.transcript) threadsText += `Transcript: ${thread.transcript}\n`;
          if (thread.notes) threadsText += `Notes: ${thread.notes}\n`;
        });
      }
      
      setInput((prev) => ({
        ...prev,
        problem: data.brief || "",
        objectives: `Request: ${data.reqTitle}\nType: ${data.reqType}\nPriority: ${data.priority}` || "",
        additionalNotes: `Owner: ${data.owner || "N/A"}\nTenant: ${data.tenant}${threadsText}` || "",
      }));
      
      // Clear intake data after loading
      localStorage.removeItem("intakeData");
    }
  }, []);

  const handleInputChange = (
    field: keyof BRDInput,
    value: string
  ) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const generateBRD = async () => {
    if (!input.problem || !input.objectives) {
      alert("Please fill in Problem and Objectives fields");
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const enrichedBRD: BRDGenerated = {
      ...input,
      requirements: `
- ${input.problem.split(".")[0]} resolution through system automation
- Implement ${input.objectives.split(",")[0]?.trim() || "solution"} workflows
- Data validation for ${input.dataRequired.split(",")[0]?.trim() || "inputs"}
- Error handling and fallback mechanisms
- Audit trail and compliance logging`,
      successCriteria: `
- 50% reduction in manual effort
- 99.5% system availability
- Zero unhandled errors in production
- 100% stakeholder approval
- All test cases passing (95% coverage)`,
      timeline: `
- Requirements finalization: 2 weeks
- Development & Testing: 4-6 weeks
- UAT: 2-3 weeks
- Go-live: 1 week preparation`,
    };

    setGenerated(enrichedBRD);
    setStep("generated");
    setIsGenerating(false);
  };

  const handleSave = () => {
    if (generated) {
      // Save to localStorage for now (can be connected to backend)
      localStorage.setItem("lastGeneratedBRD", JSON.stringify(generated));
      alert("BRD saved successfully!");
      router.push("/ba-portal");
    }
  };

  const handleSend = () => {
    if (generated) {
      localStorage.setItem("lastGeneratedBRD", JSON.stringify(generated));
      router.push("/ba-portal/send");
    }
  };

  if (step === "generated" && generated) {
    return (
      <div className={styles.container}>
        <header className={genStyles.backHeader}>
          <Link href="/ba-portal" className={genStyles.backLink}>
            ← Back to Dashboard
          </Link>
          <h1>Generated BRD</h1>
        </header>

        <div className={genStyles.generatedContainer}>
          <div className={genStyles.brdDocument}>
            <section className={genStyles.brdSection}>
              <h2>Problem Statement</h2>
              <p>{generated.problem}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Objectives</h2>
              <p>{generated.objectives}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Scope - In Scope</h2>
              <p>{generated.scopeIn}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Scope - Out of Scope</h2>
              <p>{generated.scopeOut}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Requirements</h2>
              <pre className={genStyles.preformatted}>
                {generated.requirements}
              </pre>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Success Criteria</h2>
              <pre className={genStyles.preformatted}>
                {generated.successCriteria}
              </pre>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Risks & Mitigation</h2>
              <p>{generated.risks}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Data Required</h2>
              <p>{generated.dataRequired}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Assumptions</h2>
              <p>{generated.assumptions}</p>
            </section>

            <section className={genStyles.brdSection}>
              <h2>Timeline</h2>
              <pre className={genStyles.preformatted}>
                {generated.timeline}
              </pre>
            </section>

            {generated.additionalNotes && (
              <section className={genStyles.brdSection}>
                <h2>Additional Notes</h2>
                <p>{generated.additionalNotes}</p>
              </section>
            )}
          </div>

          <div className={genStyles.actions}>
            <button
              className={genStyles.primaryBtn}
              onClick={handleSend}
            >
              → Send to Stakeholders
            </button>
            <button
              className={genStyles.secondaryBtn}
              onClick={handleSave}
            >
              Save as Draft
            </button>
            <button
              className={genStyles.tertiaryBtn}
              onClick={() => setStep("input")}
            >
              Edit & Regenerate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={genStyles.backHeader}>
        <Link href="/ba-portal" className={genStyles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Generate BRD with AI</h1>
      </header>

      <div className={genStyles.formContainer}>
        <div className={genStyles.formCard}>
          <h2>Project Information</h2>

          <div className={genStyles.formGroup}>
            <label htmlFor="problem">Problem Statement *</label>
            <textarea
              id="problem"
              placeholder="Describe the current problem or pain point that needs to be addressed..."
              rows={4}
              value={input.problem}
              onChange={(e) => handleInputChange("problem", e.target.value)}
              className={genStyles.textarea}
            />
          </div>

          <div className={genStyles.formGroup}>
            <label htmlFor="objectives">Objectives & Goals *</label>
            <textarea
              id="objectives"
              placeholder="What are the main objectives? (e.g., Reduce TAT, Improve accuracy, Enhance compliance)"
              rows={4}
              value={input.objectives}
              onChange={(e) => handleInputChange("objectives", e.target.value)}
              className={genStyles.textarea}
            />
          </div>

          <div className={genStyles.twoColumnsGrid}>
            <div className={genStyles.formGroup}>
              <label htmlFor="scopeIn">In Scope</label>
              <textarea
                id="scopeIn"
                placeholder="What's included in this BRD?"
                rows={3}
                value={input.scopeIn}
                onChange={(e) => handleInputChange("scopeIn", e.target.value)}
                className={genStyles.textarea}
              />
            </div>

            <div className={genStyles.formGroup}>
              <label htmlFor="scopeOut">Out of Scope</label>
              <textarea
                id="scopeOut"
                placeholder="What's explicitly excluded?"
                rows={3}
                value={input.scopeOut}
                onChange={(e) => handleInputChange("scopeOut", e.target.value)}
                className={genStyles.textarea}
              />
            </div>
          </div>

          <h2 style={{ marginTop: "32px" }}>Additional Details</h2>

          <div className={genStyles.twoColumnsGrid}>
            <div className={genStyles.formGroup}>
              <label htmlFor="risks">Risks & Assumptions</label>
              <textarea
                id="risks"
                placeholder="e.g., Data quality issues, Integration delays..."
                rows={3}
                value={input.risks}
                onChange={(e) => handleInputChange("risks", e.target.value)}
                className={genStyles.textarea}
              />
            </div>

            <div className={genStyles.formGroup}>
              <label htmlFor="dataRequired">Data Required</label>
              <textarea
                id="dataRequired"
                placeholder="e.g., Customer profiles, Transaction history..."
                rows={3}
                value={input.dataRequired}
                onChange={(e) => handleInputChange("dataRequired", e.target.value)}
                className={genStyles.textarea}
              />
            </div>
          </div>

          <div className={genStyles.twoColumnsGrid}>
            <div className={genStyles.formGroup}>
              <label htmlFor="assumptions">Key Assumptions</label>
              <textarea
                id="assumptions"
                placeholder="e.g., Data will be available by Week 1..."
                rows={3}
                value={input.assumptions}
                onChange={(e) => handleInputChange("assumptions", e.target.value)}
                className={genStyles.textarea}
              />
            </div>

            <div className={genStyles.formGroup}>
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                placeholder="Any other important context..."
                rows={3}
                value={input.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                className={genStyles.textarea}
              />
            </div>
          </div>

          <div className={genStyles.formActions}>
            <button
              className={genStyles.primaryBtn}
              onClick={generateBRD}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "⚡ Generate BRD with AI"}
            </button>
            <Link href="/ba-portal" className={genStyles.secondaryBtn}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
