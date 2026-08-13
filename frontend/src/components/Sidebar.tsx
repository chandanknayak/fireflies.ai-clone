"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  Upload,
  Puzzle,
  BarChart3,
  Settings,
  Sparkles,
  MessageSquare,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/api";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/", icon: Video, label: "Meetings" },
  { href: "#", icon: MessageSquare, label: "AskFred", badge: true },
  { href: "#", icon: Upload, label: "Uploads", badge: true },
  { href: "#", icon: Puzzle, label: "Integrations", badge: true },
  { href: "#", icon: BarChart3, label: "Analytics", badge: true },
  { href: "#", icon: Sparkles, label: "AI Skills", badge: true },
  { href: "#", icon: Mic, label: "Voice Agents", badge: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isMeetingsActive = pathname === "/" || pathname.startsWith("/meetings");

  return (
    <aside className="w-[220px] min-h-screen bg-white border-r border-fireflies-gray-200 flex flex-col fixed left-0 top-0 z-30">
      <div className="px-5 py-4 flex items-center gap-2.5 border-b border-fireflies-gray-100">
        <div className="w-8 h-8 gradient-fireflies rounded-lg flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-[17px] text-fireflies-gray-900 tracking-tight">fireflies.ai</span>
      </div>

      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.label === "Meetings" ? isMeetingsActive : pathname === item.href;
          const Icon = item.icon;

          if (item.badge) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-fireflies-gray-400 cursor-not-allowed text-[13px]"
                title="Coming Soon"
              >
                <Icon className="w-[17px] h-[17px] shrink-0" />
                <span className="font-medium flex-1">{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors duration-150 text-[13px]",
                isActive
                  ? "bg-fireflies-purple-light text-fireflies-purple font-semibold"
                  : "text-fireflies-gray-600 hover:bg-fireflies-gray-100 font-medium"
              )}
            >
              <Icon className="w-[17px] h-[17px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2.5 py-3 border-t border-fireflies-gray-200">
        <div
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-fireflies-gray-600 text-[13px] cursor-not-allowed"
          title="Coming Soon"
        >
          <Settings className="w-[17px] h-[17px]" />
          <span className="font-medium">Settings</span>
        </div>
        <div className="mt-2 mx-1 p-2.5 rounded-xl bg-fireflies-gray-50 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full gradient-fireflies flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-fireflies-gray-900 truncate">Jane Doe</p>
            <p className="text-[11px] text-fireflies-gray-500 truncate">jane@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
