import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/context/ToastContext";
import ToastContainer from "@/components/ToastContainer";

export const metadata: Metadata = {
  title: "Fireflies — Meeting Notes & Transcription",
  description: "AI-powered meeting notes and transcription platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-[220px]">{children}</main>
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
