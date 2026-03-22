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
    <div className="min-h-screen bg-slate-50">
      <PortalSidebar title={title} navItems={navItems} />
      <div className="ml-0 min-h-screen lg:ml-72">
        <PortalHeader userName={userName} />
        <main className="px-4 py-5 sm:px-6 animate-fade-in">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
