import { DataTable } from "@/components/tables/DataTable";
import { bugs } from "@/lib/mockData";

export default function BugTrackingPage() {
  return <DataTable title="Bug Tracking" rows={bugs} />;
}
