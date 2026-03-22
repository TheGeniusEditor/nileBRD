import { RoleLayout } from "@/components/dashboard/RoleLayout";
import { baNav } from "@/lib/mockData";

export default function BALayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout title="Business Analyst Portal" userName="Ananya BA" navItems={baNav}>
      {children}
    </RoleLayout>
  );
}
