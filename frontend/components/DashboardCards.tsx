import { Activity, Bug, FileText, FlaskConical, FolderKanban, Rocket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardsProps {
  totalBusinessProblems: number;
  brdsGenerated: number;
  activeProjects: number;
  sitStatus: string;
  uatStatus: string;
  openBugs: number;
  deployments: number;
}

const cardConfig = [
  { key: "totalBusinessProblems", title: "Total Business Problems", icon: FolderKanban },
  { key: "brdsGenerated", title: "BRDs Generated", icon: FileText },
  { key: "activeProjects", title: "Active Projects", icon: Activity },
  { key: "sitStatus", title: "SIT Status", icon: FlaskConical },
  { key: "uatStatus", title: "UAT Status", icon: FlaskConical },
  { key: "openBugs", title: "Open Bugs", icon: Bug },
  { key: "deployments", title: "Deployments", icon: Rocket },
] as const;

export function DashboardCards(props: DashboardCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cardConfig.map((config) => {
        const Icon = config.icon;
        const value = props[config.key];

        return (
          <Card key={config.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-slate-600">{config.title}</CardTitle>
              <Icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-slate-900">{value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
