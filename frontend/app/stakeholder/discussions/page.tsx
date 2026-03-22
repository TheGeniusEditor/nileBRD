import { ChatPanel } from "@/components/chat/ChatPanel";
import { Card } from "@/components/ui/Card";
import { stakeholderMessages } from "@/lib/mockData";

export default function StakeholderDiscussionsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">
      <ChatPanel initialMessages={stakeholderMessages} />
      <Card>
        <h3 className="mb-3 text-base font-semibold text-slate-800">AI Summarized Insights</h3>
        <p className="text-sm leading-6 text-slate-600">
          Stakeholders are aligned on objective and expected outcomes. Clarification is still required on legal constraints and
          integration ownership before FRD lock.
        </p>
      </Card>
    </div>
  );
}
