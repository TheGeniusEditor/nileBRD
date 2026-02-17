"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

const flowSteps = [
  {
    id: "login",
    title: "Login",
    route: "/login",
    detail: "Entry to role workspaces",
  },
  {
    id: "discussions",
    title: "BA discussions with stakeholders",
    route: "/intake",
    detail: "Business, Credit, Risk, Ops, Compliance, Others",
  },
  {
    id: "noting",
    title: "Noting discussions",
    route: "/intake",
    detail: "Capture notes and transcripts",
  },
  {
    id: "prepare-brd",
    title: "Preparing BRD",
    route: "/role/ba",
    detail: "Draft BRD and consolidate inputs",
  },
  {
    id: "brd-gen",
    title: "BRD generation",
    route: "/brd-generator",
    detail: "Deterministic + AI draft preview",
  },
  {
    id: "rollout",
    title: "Rolling BRD to stakeholders",
    route: "/role/sme",
    detail: "Review, change, approve",
  },
  {
    id: "stakeholder-approval",
    title: "Stakeholder approvals",
    route: "/role/sme",
    detail: "Component approval + end-to-end flow",
  },
  {
    id: "final-approval",
    title: "Final Business + Project Head approval",
    route: "/preview",
    detail: "Final approval before IT review",
  },
  {
    id: "it-share",
    title: "Share to IT",
    route: "/role/it",
    detail: "Review and feasibility",
  },
  {
    id: "it-feasibility",
    title: "IT feasibility + cost estimate",
    route: "/role/it",
    detail: "SPOC + IT Head approval",
  },
  {
    id: "cost-approval",
    title: "Final cost approval",
    route: "/role/it",
    detail: "Business Head + Project Head",
  },
  {
    id: "timelines",
    title: "IT development timelines",
    route: "/role/it",
    detail: "BA follows up on progress",
  },
  {
    id: "sit",
    title: "IT SIT",
    route: "/role/it",
    detail: "System integration testing",
  },
  {
    id: "uat-delivery",
    title: "IT delivery for UAT",
    route: "/role/it",
    detail: "UAT environment ready",
  },
  {
    id: "test-cases",
    title: "Test cases preparation",
    route: "/role/it",
    detail: "IT + BA + stakeholders",
  },
  {
    id: "uat-testing",
    title: "UAT delivery & testing",
    route: "/role/it",
    detail: "Execution and evidence",
  },
  {
    id: "uat-signoff",
    title: "UAT signoff",
    route: "/role/sme",
    detail: "Stakeholder approval",
  },
  {
    id: "prod-timeline",
    title: "Production timelines",
    route: "/role/it",
    detail: "Release planning",
  },
  {
    id: "prod-delivery",
    title: "Production delivery",
    route: "/role/it",
    detail: "Go-live readiness",
  },
  {
    id: "prod-signoff",
    title: "Production signoff",
    route: "/preview",
    detail: "IT + Business + Stakeholders",
  },
];

const pageIO = {
  home: {
    inputs: ["Flow definition", "Role mapping"],
    outputs: ["Navigation to workspaces", "Flow overview"],
  },
  login: {
    inputs: ["Email", "Role mode"],
    outputs: ["Session routing", "Role landing"],
  },
  intake: {
    inputs: ["Call transcripts", "Meeting notes"],
    outputs: ["Consolidated gist", "Attribute extraction"],
  },
  ba: {
    inputs: ["Gist", "Stakeholder inputs"],
    outputs: ["Draft BRD", "Approval routing"],
  },
  stakeholder: {
    inputs: ["Draft BRD sections"],
    outputs: ["Review comments", "Approval decision"],
  },
  risk: {
    inputs: ["BRD NFR/FR"],
    outputs: ["Risk controls", "Risk approval"],
  },
  compliance: {
    inputs: ["Regulatory obligations", "Evidence"],
    outputs: ["Compliance decision", "Audit trail"],
  },
  infosec: {
    inputs: ["Threat model", "Data classification"],
    outputs: ["Security controls", "Security decision"],
  },
  it: {
    inputs: ["BRD scope", "Architecture"],
    outputs: ["Feasibility", "Cost", "Timeline"],
  },
  preview: {
    inputs: ["Approved BRD", "Signatures"],
    outputs: ["Signed pack", "Final publish"],
  },
  admin: {
    inputs: ["User directory", "SoD rules"],
    outputs: ["User access", "Audit updates"],
  },
  generator: {
    inputs: ["Notes", "Structured hints"],
    outputs: ["Deterministic BRD", "AI BRD"],
  },
};

function matchPage(pathname: string) {
  if (pathname === "/") return pageIO.home;
  if (pathname.startsWith("/login")) return pageIO.login;
  if (pathname.startsWith("/intake")) return pageIO.intake;
  if (pathname.startsWith("/role/ba")) return pageIO.ba;
  if (pathname.startsWith("/role/sme")) return pageIO.stakeholder;
  if (pathname.startsWith("/role/risk")) return pageIO.risk;
  if (pathname.startsWith("/role/compliance")) return pageIO.compliance;
  if (pathname.startsWith("/role/infosec")) return pageIO.infosec;
  if (pathname.startsWith("/role/it")) return pageIO.it;
  if (pathname.startsWith("/role/admin") || pathname.startsWith("/admin")) {
    return pageIO.admin;
  }
  if (pathname.startsWith("/preview")) return pageIO.preview;
  if (pathname.startsWith("/user-management")) return pageIO.admin;
  if (pathname.startsWith("/brd-generator")) return pageIO.generator;
  return pageIO.home;
}

export default function FlowSidebar() {
  const pathname = usePathname();
  const activeIndex = useMemo(() => {
    const idx = flowSteps.findIndex((step) => pathname.startsWith(step.route));
    return idx === -1 ? 0 : idx;
  }, [pathname]);
  const io = matchPage(pathname);

  return (
    <aside className="app-sidebar">
      <div className="sidebar-head">
        <p className="kicker">Flow slider</p>
        <h2>BRD automation journey</h2>
        <p className="muted">
          Follow the end-to-end approvals, feasibility, delivery, and sign-off.
        </p>
      </div>

      <div className="flow-list">
        {flowSteps.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          return (
            <a
              key={step.id}
              href={step.route}
              className={`flow-step${isActive ? " active" : ""}${
                isDone ? " done" : ""
              }`}
            >
              <div className="flow-dot" />
              <div>
                <div className="flow-title">{step.title}</div>
                <div className="flow-detail">{step.detail}</div>
              </div>
            </a>
          );
        })}
      </div>

      <div className="io-card">
        <h3>Inputs / Outputs</h3>
        <div className="io-grid">
          <div>
            <p className="io-label">Inputs</p>
            <ul>
              {io.inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="io-label">Outputs</p>
            <ul>
              {io.outputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
