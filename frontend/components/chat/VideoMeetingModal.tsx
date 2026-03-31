"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface Props {
  roomUrl: string;
  onClose: () => void;
}

export function VideoMeetingModal({ roomUrl, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const frameRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    (async () => {
      const DailyIframe = (await import("@daily-co/daily-js")).default;
      const frame = DailyIframe.createFrame(containerRef.current!, {
        showLeaveButton: false,
        showFullscreenButton: true,
        iframeStyle: {
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "0",
        },
      });
      frameRef.current = frame;
      frame.on("left-meeting", onClose);
      await frame.join({ url: roomUrl });
    })();

    return () => {
      if (frameRef.current) {
        frameRef.current.leave().catch(() => {});
        frameRef.current.destroy();
        frameRef.current = null;
      }
    };
  // roomUrl intentionally omitted — only create frame once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between bg-slate-900 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-white">Video Meeting in progress</span>
        </div>
        <button
          onClick={async () => {
            if (frameRef.current) {
              await frameRef.current.leave().catch(() => {});
            }
            onClose();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
        >
          <X className="size-3.5" />
          Leave Meeting
        </button>
      </div>
      {/* Video frame */}
      <div ref={containerRef} className="flex-1" />
    </div>,
    document.body
  );
}
