"use client";

import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/api";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[280px] max-w-[400px] animate-in slide-in-from-right",
            toast.type === "success" && "bg-white border-green-200",
            toast.type === "error" && "bg-white border-red-200",
            toast.type === "info" && "bg-white border-blue-200"
          )}
        >
          {toast.type === "success" && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 shrink-0" />}
          <p className="text-sm text-fireflies-gray-800 flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="text-fireflies-gray-400 hover:text-fireflies-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
