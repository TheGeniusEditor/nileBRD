"use client";

/**
 * Compatibility shim — forwards to StreamChatPanel.
 * Existing pages pass currentUserId + currentUserName; this shim reads
 * role and email from the stored JWT and maps to the new prop shape.
 */
import { StreamChatPanel } from "./StreamChatPanel";

interface RequestInfo {
  id: number;
  req_number: string;
  title: string;
  priority: string;
  status: string;
}

interface Props {
  request: RequestInfo;
  currentUserId: number;
  currentUserName: string;
  onBack?: () => void;
}

function readJwtField(field: string): string {
  try {
    const t = localStorage.getItem("authToken");
    if (!t) return "";
    return JSON.parse(atob(t.split(".")[1]))[field] ?? "";
  } catch {
    return "";
  }
}

export function RequestChat({ request, currentUserId, currentUserName, onBack }: Props) {
  const role  = readJwtField("role") || "stakeholder";
  const email = readJwtField("email");

  return (
    <StreamChatPanel
      request={request}
      currentUser={{ id: currentUserId, name: currentUserName, email, role }}
      onBack={onBack}
    />
  );
}
