import { type ReactNode } from "react";

import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { PortalHeader } from "@/components/dashboard/PortalHeader";
import { PortalSidebar } from "@/components/dashboard/PortalSidebar";
import { type NavItem } from "@/lib/mockData";

type RoleLayoutProps = {
  title: string;
  userName: string;
  navItems: NavItem[];
  children: ReactNode;
};

export function RoleLayout({ title, userName, navItems, children }: RoleLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      <PortalSidebar title={title} navItems={navItems} />
      <div className="ml-0 min-h-screen lg:ml-72">
        <PortalHeader userName={userName} />
        <main className="px-6 py-8 sm:px-8 animate-fade-in max-w-7xl mx-auto">
          <Breadcrumbs />
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
