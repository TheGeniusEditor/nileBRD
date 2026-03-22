import { RoleLayout } from "@/components/dashboard/RoleLayout";
import { stakeholderNav } from "@/lib/mockData";

export default function StakeholderLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout title="Stakeholder Portal" userName="Maya Stakeholder" navItems={stakeholderNav}>
      {children}
    </RoleLayout>
  );
}
