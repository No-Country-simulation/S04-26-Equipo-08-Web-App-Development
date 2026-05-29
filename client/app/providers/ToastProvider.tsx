"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useContext, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastState = {
  open: boolean;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (title: string, description?: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const colorMap = {
  success: {
    border: "border-green-500/30",
    bg: "bg-green-50",
    icon: "text-green-600",
    text: "text-green-900",
    desc: "text-green-700",
  },
  error: {
    border: "border-red-500/30",
    bg: "bg-red-50",
    icon: "text-red-600",
    text: "text-red-900",
    desc: "text-red-700",
  },
  info: {
    border: "border-indigo-500/30",
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    text: "text-indigo-900",
    desc: "text-indigo-700",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    title: "",
    description: "",
    type: "info",
  });

  function showToast(title: string, description?: string, type: ToastType = "info") {
    setToast({ open: true, title, description, type });
  }

  const c = colorMap[toast.type];
  const Icon = iconMap[toast.type];

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          open={toast.open}
          onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
          className={`
            fixed right-6 top-6 z-50
            min-w-[360px] max-w-[420px]
            rounded-2xl border-2 ${c.border} ${c.bg}
            p-5 shadow-2xl
            data-[state=open]:animate-slide-in
            data-[state=closed]:animate-slide-out
          `}
        >
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 mt-0.5 ${c.icon}`}>
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <Toast.Title className={`font-semibold text-base ${c.text}`}>
                {toast.title}
              </Toast.Title>
              {toast.description && (
                <Toast.Description className={`mt-1 text-sm ${c.desc}`}>
                  {toast.description}
                </Toast.Description>
              )}
            </div>
            <Toast.Close className={`flex-shrink-0 ${c.icon} hover:opacity-70 transition-opacity`}>
              <XCircle size={18} />
            </Toast.Close>
          </div>
        </Toast.Root>

        <Toast.Viewport className="fixed right-0 top-0 z-50 flex flex-col gap-3 p-6 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useAppToast must be used inside ToastProvider");
  return context;
}