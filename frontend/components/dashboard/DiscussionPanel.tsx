"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { RequestChat } from "@/components/chat/RequestChat";

type ReqInfo = {
  id: number;
  req_number: string;
  title: string;
  priority: string;
  status: string;
};

type ContextType = {
  openDiscussion: (req: ReqInfo, userId: number, userName: string) => void;
};

const DiscussionPanelContext = createContext<ContextType>({ openDiscussion: () => {} });

export function useDiscussionPanel() {
  return useContext(DiscussionPanelContext);
}

export function DiscussionPanelProvider({ children }: { children: ReactNode }) {
  const [chatReq, setChatReq]   = useState<ReqInfo | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [userId, setUserId]     = useState(0);
  const [userName, setUserName] = useState("");
  const closeTimer              = useRef<ReturnType<typeof setTimeout>>();

  const openDiscussion = (req: ReqInfo, uid: number, uname: string) => {
    clearTimeout(closeTimer.current);
    setUserId(uid);
    setUserName(uname);
    setChatReq(req);
    requestAnimationFrame(() => setChatOpen(true));
  };

  const closeDiscussion = () => {
    setChatOpen(false);
    closeTimer.current = setTimeout(() => setChatReq(null), 380);
  };

  return (
    <DiscussionPanelContext.Provider value={{ openDiscussion }}>
      {children}

      {chatReq && (
        <div
          className={`absolute inset-0 z-10 flex flex-col bg-white transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            chatOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Accent bar */}
          <div className="h-0.5 shrink-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />
          <div className="min-h-0 flex-1">
            <RequestChat
              request={chatReq}
              currentUserId={userId}
              currentUserName={userName}
              onBack={closeDiscussion}
            />
          </div>
        </div>
      )}
    </DiscussionPanelContext.Provider>
  );
}
