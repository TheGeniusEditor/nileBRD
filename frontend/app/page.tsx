import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, Cpu } from "lucide-react";
import { type CSSProperties } from "react";

import { Card } from "@/components/ui/Card";

const portals = [
  {
    title: "Stakeholder Portal",
    desc: "Submit business problems, track requests, discuss, and approve requirement artifacts.",
    href: "/stakeholder/dashboard",
    icon: Building2,
  },
  {
    title: "Business Analyst Portal",
    desc: "Manage assigned problems, generate BRD/FRD, and prepare user stories with AI simulation.",
    href: "/ba/dashboard",
    icon: BriefcaseBusiness,
  },
  {
    title: "IT Portal",
    desc: "Review feasibility, monitor development, track SIT and bugs, and manage deployments.",
    href: "/it/dashboard",
    icon: Cpu,
  },
];

export default function LandingPage() {
  return (
    <div className="mx-auto min-h-screen max-w-6xl px-5 py-12 sm:px-8">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-blue-600 animate-fade-in">Enterprise Frontend Prototype</p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">AI Business Requirement Management Portal</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          A complete role-based frontend experience for Stakeholders, Business Analysts, and IT teams.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {portals.map((portal, index) => {
          const Icon = portal.icon;
          return (
            <Link href={portal.href} key={portal.title}>
              <Card
                className="h-full border-blue-100 transition hover:-translate-y-0.5 hover:border-blue-300 animate-rise stagger-item"
                style={{ "--stagger-delay": `${120 + index * 90}ms` } as CSSProperties}
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-2 text-blue-600">
                  <Icon size={18} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{portal.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{portal.desc}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-700">
                  Enter portal
                  <ArrowRight size={15} />
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
