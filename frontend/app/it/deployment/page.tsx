import { DataTable } from "@/components/tables/DataTable";
import { deployments } from "@/lib/mockData";

export default function DeploymentPage() {
  return <DataTable title="Deployment Timeline" rows={deployments} />;
}
