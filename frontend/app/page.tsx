import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Cpu,
  Zap,
  Users,
  Lock,
} from "lucide-react";
import { type CSSProperties } from "react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const portals = [
  {
    title: "Stakeholder Portal",
    desc: "Submit business problems, track requests, discuss, and approve requirement artifacts with ease.",
    href: "/stakeholder/dashboard",
    icon: Building2,
    color: "from-blue-600 to-blue-400",
    lightColor: "from-blue-50 to-blue-100",
    stats: "150+ Active Stakeholders",
  },
  {
    title: "Business Analyst Portal",
    desc: "Manage assigned problems, generate BRD/FRD, and prepare user stories with AI simulation.",
    href: "/ba/dashboard",
    icon: BriefcaseBusiness,
    color: "from-purple-600 to-purple-400",
    lightColor: "from-purple-50 to-purple-100",
    stats: "80+ Active Analysts",
  },
  {
    title: "IT Portal",
    desc: "Review feasibility, monitor development, track SIT and bugs, and manage deployments.",
    href: "/it/dashboard",
    icon: Cpu,
    color: "from-cyan-600 to-cyan-400",
    lightColor: "from-cyan-50 to-cyan-100",
    stats: "120+ Active Engineers",
  },
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized performance for seamless experience",
  },
  {
    icon: Users,
    title: "Collaborative",
    desc: "Real-time discussions and approvals",
  },
  {
    icon: Lock,
    title: "Secure",
    desc: "Role-based access control",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-12 sm:px-8">
        <div className="text-center mb-16">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-blue-600 font-bold animate-fade-in">
            Enterprise Management Platform
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 animate-slide-in-down leading-tight">
            AI Business Requirement
            <span
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="ml-2"
            >
              Management Portal
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 leading-relaxed animate-slide-in-up">
            A comprehensive role-based platform designed for Stakeholders, Business
            Analysts, and IT teams to collaborate, manage requirements, and streamline
            the complete business lifecycle.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in">
            <Link href="/stakeholder/dashboard">
              <Button variant="gradient-primary" size="lg" className="group">
                Get Started
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>
            <button className="px-6 py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-medium hover:bg-slate-100 hover:border-slate-400 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <Link href={portal.href} key={portal.title}>
                <Card
                  variant="gradient-subtle"
                  hoverable
                  className="h-full relative overflow-hidden group animate-rise stagger-item"
                  style={{
                    "--stagger-delay": `${120 + index * 90}ms`,
                  } as CSSProperties}
                >
                  {/* Background gradient effect */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${portal.color} transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${portal.lightColor} p-4 text-slate-900 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <Icon size={28} />
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {portal.title}
                    </h2>
                    <p className="text-slate-600 mb-5 leading-relaxed">
                      {portal.desc}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-5 border-t border-slate-200">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {portal.stats}
                      </span>
                      <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                        Access
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12 animate-fade-in">
            Why Choose Our Platform
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  variant="elevated"
                  className="text-center p-8 animate-rise stagger-item"
                  style={{
                    "--stagger-delay": `${60 + index * 100}ms`,
                  } as CSSProperties}
                >
                  <div className="mx-auto mb-4 inline-flex rounded-xl bg-blue-100 p-3 text-blue-600">
                    <FeatureIcon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-20 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-12 text-white text-center shadow-2xl animate-scale-in">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
          <p className="mb-8 text-lg opacity-90">
            Join hundreds of organizations already using our platform
          </p>
          <Link href="/stakeholder/dashboard">
            <Button variant="secondary" size="lg" className="hover:scale-105">
              Start Free Trial
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
