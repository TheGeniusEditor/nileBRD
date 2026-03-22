"use client";

import { useState } from "react";

import { AILoader } from "@/components/ui/AILoader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { simulateAIGeneration } from "@/lib/aiMock";

export default function FRDManagementPage() {
  const [doc, setDoc] = useState("Convert BRD to FRD with AI simulation.");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const output = await simulateAIGeneration("frd", "Create architecture and API sections from BRD");
    setDoc(output);
    setLoading(false);
  };

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">FRD Management</h2>
        <Button onClick={generate}>Convert BRD to FRD</Button>
      </div>
      {loading && <AILoader />}
      <Textarea rows={18} value={doc} onChange={(event) => setDoc(event.target.value)} className="mt-3 font-mono text-xs" />
    </Card>
  );
}
