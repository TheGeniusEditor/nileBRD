"use client";

import { X } from "lucide-react";
import { type ReactNode } from "react";

import { Button } from "@/components/ui/Button";

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ isOpen, title, children, onClose, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl bg-white p-6 shadow-2xl animate-scale-in`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-slate-100"
          >
            <X size={20} className="text-slate-600" />
          </Button>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>
      </div>
    </div>
  );
}