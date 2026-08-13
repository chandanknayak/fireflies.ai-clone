"use client";

import { Search, List, Scissors, MessageCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/api";

const tools = [
  { icon: Search, label: "Smart Search", id: "search" },
  { icon: List, label: "Index", id: "index" },
  { icon: Scissors, label: "Soundbites", id: "soundbites" },
  { icon: MessageCircle, label: "Comments", id: "comments" },
  { icon: Bookmark, label: "Bookmarks", id: "bookmarks" },
];

interface NotepadIconRailProps {
  activeTool?: string;
}

export default function NotepadIconRail({ activeTool = "search" }: NotepadIconRailProps) {
  return (
    <aside className="w-12 shrink-0 border-r border-fireflies-gray-200 bg-white flex flex-col items-center py-4 gap-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            title={tool.label}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              isActive
                ? "bg-fireflies-purple-light text-fireflies-purple"
                : "text-fireflies-gray-400 hover:bg-fireflies-gray-100 hover:text-fireflies-gray-600"
            )}
          >
            <Icon className="w-[18px] h-[18px]" />
          </button>
        );
      })}
    </aside>
  );
}
