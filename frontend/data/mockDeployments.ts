import { type Deployment } from "@/data/types";

export const mockDeployments: Deployment[] = [
  {
    id: "DEP-901",
    milestone: "Workflow Engine Integration",
    environment: "Development",
    releaseDate: "2026-03-05",
    status: "Completed",
  },
  {
    id: "DEP-902",
    milestone: "SIT Candidate Release",
    environment: "Testing",
    releaseDate: "2026-03-11",
    status: "Validated",
  },
  {
    id: "DEP-903",
    milestone: "Production Rollout Wave 1",
    environment: "Production",
    releaseDate: "2026-03-18",
    status: "Planned",
  },
];
