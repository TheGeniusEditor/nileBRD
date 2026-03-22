import { RoleLayout } from "@/components/dashboard/RoleLayout";
import { itNav } from "@/lib/mockData";

export default function ITLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout title="IT Portal" userName="Ravi IT Lead" navItems={itNav}>
      {children}
    </RoleLayout>
  );
}
