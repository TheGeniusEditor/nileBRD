import { ChatPanel } from "@/components/chat/ChatPanel";
import { Card } from "@/components/ui/Card";
import { stakeholderMessages } from "@/lib/mockData";

export default function BADiscussionsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.5fr,1fr]">
      <ChatPanel initialMessages={stakeholderMessages} placeholder="Reply to stakeholders..." />
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">Meeting Notes</h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>- Scope accepted with one legal dependency.</li>
          <li>- Stakeholder requested SLA clauses in BRD.</li>
          <li>- IT requested API limit data before FRD freeze.</li>
        </ul>
      </Card>
    </div>
  );
}
