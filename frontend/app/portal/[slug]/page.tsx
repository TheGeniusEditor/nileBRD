import { type ComponentType } from "react";
import { notFound } from "next/navigation";

import { AdminDashboard } from "@/components/portals/AdminDashboard";
import { BADashboard } from "@/components/portals/BADashboard";
import { ITDashboard } from "@/components/portals/ITDashboard";
import { ITPMDashboard } from "@/components/portals/ITPMDashboard";
import { StakeholderDashboard } from "@/components/portals/StakeholderDashboard";
import { VendorDashboard } from "@/components/portals/VendorDashboard";
import { portalBySlug } from "@/data/portalConfig";

/* Map each slug to its dedicated role dashboard */
const dashboardMap: Record<string, ComponentType> = {
  stakeholder: StakeholderDashboard,
  ba:          BADashboard,
  it:          ITDashboard,
  "it-pm":     ITPMDashboard,
  vendor:      VendorDashboard,
  admin:       AdminDashboard,
};

export default async function PortalSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portal = portalBySlug[slug];
  if (!portal) notFound();

  const DashboardComponent = dashboardMap[slug];
  if (!DashboardComponent) notFound();

  return <DashboardComponent />;
}

export async function generateStaticParams() {
  return Object.keys(portalBySlug).map((slug) => ({ slug }));
}
