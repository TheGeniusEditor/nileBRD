"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../styles.module.css";
import newStyles from "./new.module.css";

type BRDForm = {
  projectName: string;
  businessArea: string;
  priority: string;
  problem: string;
  objectives: string;
  scopeIn: string;
  scopeOut: string;
  risks: string;
  dataRequired: string;
  assumptions: string;
  stakeholders: string;
};

const defaultForm: BRDForm = {
  projectName: "",
  businessArea: "",
  priority: "medium",
  problem: "",
  objectives: "",
  scopeIn: "",
  scopeOut: "",
  risks: "",
  dataRequired: "",
  assumptions: "",
  stakeholders: "",
};

const steps = [
  { id: 1, title: "Project Details", description: "Basic project information" },
  { id: 2, title: "Problem & Objectives", description: "Define the problem and goals" },
  { id: 3, title: "Scope", description: "Define what's in and out" },
  { id: 4, title: "Risks & Data", description: "Identify risks and data needs" },
  { id: 5, title: "Review", description: "Review and submit" },
];

export default function NewBRDPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<BRDForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BRDForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!form.projectName || !form.problem || !form.objectives) {
      alert("Please fill in required fields");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save form as initial BRD draft
    localStorage.setItem("newBRDDraft", JSON.stringify(form));
    setIsSubmitting(false);
    
    // Redirect to AI generation with pre-filled data
    router.push("/ba-portal/generate");
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={styles.container}>
      <header className={newStyles.backHeader}>
        <Link href="/ba-portal" className={newStyles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>Create New BRD</h1>
      </header>

      <div className={newStyles.mainGrid}>
        {/* Left Sidebar - Steps */}
        <div className={newStyles.sidebar}>
          <div className={newStyles.stepsContainer}>
            <div className={newStyles.progressBar} style={{width: `${progressPercentage}%`}} />
            {steps.map((step) => (
              <div
                key={step.id}
                className={`${newStyles.stepItem} ${
                  step.id === currentStep ? newStyles.active : ""
                } ${step.id < currentStep ? newStyles.completed : ""}`}
                onClick={() => step.id <= currentStep + 1 && setCurrentStep(step.id)}
              >
                <div className={newStyles.stepNumber}>{step.id}</div>
                <div className={newStyles.stepLabel}>
                  <div className={newStyles.stepTitle}>{step.title}</div>
                  <div className={newStyles.stepDesc}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={newStyles.estimation}>
            <h3>Estimated Time</h3>
            <p>10-15 minutes</p>
            <small>to complete this form</small>
          </div>
        </div>

        {/* Right Content - Form */}
        <div className={newStyles.content}>
          <div className={newStyles.formCard}>
            {currentStep === 1 && (
              <div className={newStyles.stepContent}>
                <h2>Project Details</h2>
                <p className={newStyles.help}>
                  Start by providing basic information about your project.
                </p>

                <div className={newStyles.formGroup}>
                  <label htmlFor="projectName">Project Name *</label>
                  <input
                    id="projectName"
                    type="text"
                    placeholder="e.g., Renewal Automation Phase 1"
                    value={form.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    className={newStyles.input}
                  />
                </div>

                <div className={newStyles.twoColumns}>
                  <div className={newStyles.formGroup}>
                    <label htmlFor="businessArea">Business Area *</label>
                    <select
                      id="businessArea"
                      value={form.businessArea}
                      onChange={(e) => handleInputChange("businessArea", e.target.value)}
                      className={newStyles.select}
                    >
                      <option value="">Select Business Area</option>
                      <option value="retail">Retail Banking</option>
                      <option value="corporate">Corporate Banking</option>
                      <option value="credit">Credit & Cards</option>
                      <option value="operations">Operations</option>
                      <option value="risk">Risk & Compliance</option>
                      <option value="it">Technology</option>
                    </select>
                  </div>

                  <div className={newStyles.formGroup}>
                    <label htmlFor="priority">Priority Level</label>
                    <select
                      id="priority"
                      value={form.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      className={newStyles.select}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className={newStyles.stepContent}>
                <h2>Problem & Objectives</h2>
                <p className={newStyles.help}>
                  Describe the problem you're solving and the desired outcomes.
                </p>

                <div className={newStyles.formGroup}>
                  <label htmlFor="problem">Problem Statement *</label>
                  <textarea
                    id="problem"
                    placeholder="Describe the current pain point..."
                    rows={4}
                    value={form.problem}
                    onChange={(e) => handleInputChange("problem", e.target.value)}
                    className={newStyles.textarea}
                  />
                </div>

                <div className={newStyles.formGroup}>
                  <label htmlFor="objectives">Objectives & Goals *</label>
                  <textarea
                    id="objectives"
                    placeholder="What do you want to achieve? (comma-separated)"
                    rows={4}
                    value={form.objectives}
                    onChange={(e) => handleInputChange("objectives", e.target.value)}
                    className={newStyles.textarea}
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className={newStyles.stepContent}>
                <h2>Define Scope</h2>
                <p className={newStyles.help}>
                  Clearly define what's included and excluded from this project.
                </p>

                <div className={newStyles.twoColumns}>
                  <div className={newStyles.formGroup}>
                    <label htmlFor="scopeIn">In Scope</label>
                    <textarea
                      id="scopeIn"
                      placeholder="What's included in this project?"
                      rows={5}
                      value={form.scopeIn}
                      onChange={(e) => handleInputChange("scopeIn", e.target.value)}
                      className={newStyles.textarea}
                    />
                  </div>

                  <div className={newStyles.formGroup}>
                    <label htmlFor="scopeOut">Out of Scope</label>
                    <textarea
                      id="scopeOut"
                      placeholder="What's explicitly excluded?"
                      rows={5}
                      value={form.scopeOut}
                      onChange={(e) => handleInputChange("scopeOut", e.target.value)}
                      className={newStyles.textarea}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className={newStyles.stepContent}>
                <h2>Risks, Data & Assumptions</h2>
                <p className={newStyles.help}>
                  Identify potential risks and data requirements.
                </p>

                <div className={newStyles.formGroup}>
                  <label htmlFor="risks">Risks & Mitigation</label>
                  <textarea
                    id="risks"
                    placeholder="e.g., Data quality issues, Integration delays..."
                    rows={3}
                    value={form.risks}
                    onChange={(e) => handleInputChange("risks", e.target.value)}
                    className={newStyles.textarea}
                  />
                </div>

                <div className={newStyles.twoColumns}>
                  <div className={newStyles.formGroup}>
                    <label htmlFor="dataRequired">Data Required</label>
                    <textarea
                      id="dataRequired"
                      placeholder="e.g., Customer profiles, Transaction history..."
                      rows={3}
                      value={form.dataRequired}
                      onChange={(e) => handleInputChange("dataRequired", e.target.value)}
                      className={newStyles.textarea}
                    />
                  </div>

                  <div className={newStyles.formGroup}>
                    <label htmlFor="assumptions">Assumptions</label>
                    <textarea
                      id="assumptions"
                      placeholder="Key assumptions..."
                      rows={3}
                      value={form.assumptions}
                      onChange={(e) => handleInputChange("assumptions", e.target.value)}
                      className={newStyles.textarea}
                    />
                  </div>
                </div>

                <div className={newStyles.formGroup}>
                  <label htmlFor="stakeholders">Key Stakeholders</label>
                  <textarea
                    id="stakeholders"
                    placeholder="List stakeholders (comma-separated)"
                    rows={2}
                    value={form.stakeholders}
                    onChange={(e) => handleInputChange("stakeholders", e.target.value)}
                    className={newStyles.textarea}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className={newStyles.stepContent}>
                <h2>Review & Confirm</h2>
                <p className={newStyles.help}>
                  Review your BRD details before proceeding to AI generation.
                </p>

                <div className={newStyles.reviewGrid}>
                  <div className={newStyles.reviewItem}>
                    <span className={newStyles.reviewLabel}>Project Name</span>
                    <span className={newStyles.reviewValue}>{form.projectName}</span>
                  </div>
                  <div className={newStyles.reviewItem}>
                    <span className={newStyles.reviewLabel}>Business Area</span>
                    <span className={newStyles.reviewValue}>{form.businessArea || "Not specified"}</span>
                  </div>
                  <div className={newStyles.reviewItem}>
                    <span className={newStyles.reviewLabel}>Priority</span>
                    <span className={newStyles.reviewValue}>
                      <span className={newStyles.badge}>
                        {form.priority.charAt(0).toUpperCase() + form.priority.slice(1)}
                      </span>
                    </span>
                  </div>
                </div>

                <div className={newStyles.reviewSection}>
                  <h3>Problem Statement</h3>
                  <p>{form.problem || "Not provided"}</p>
                </div>

                <div className={newStyles.reviewSection}>
                  <h3>Objectives</h3>
                  <p>{form.objectives || "Not provided"}</p>
                </div>

                <div className={newStyles.reviewSection}>
                  <h3>Next Steps</h3>
                  <ul>
                    <li>Your BRD draft will be saved</li>
                    <li>AI will generate comprehensive requirements based on your inputs</li>
                    <li>You can edit and customize the generated BRD</li>
                    <li>Finally, you'll send it to stakeholders for review</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={newStyles.navigation}>
              <button
                className={newStyles.secondaryBtn}
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                ← Previous
              </button>

              {currentStep < steps.length ? (
                <button className={newStyles.primaryBtn} onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button
                  className={newStyles.primaryBtn}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Generate BRD with AI"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
