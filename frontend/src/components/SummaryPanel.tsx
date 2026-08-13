"use client";

import { Copy, List, ChevronDown, Share2, Sparkles } from "lucide-react";
import type { MeetingDetail } from "@/types";
import { formatTimestamp } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ActionItemsList from "./ActionItemsList";

interface SummaryPanelProps {
  meeting: MeetingDetail;
  onSeek: (time: number) => void;
  onUpdate: () => void;
}

export default function SummaryPanel({ meeting, onSeek, onUpdate }: SummaryPanelProps) {
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(meeting.summary);
    showToast("Summary copied to clipboard");
  };

  const renderSummary = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="font-display font-bold text-base text-fireflies-gray-900 mt-5 mb-2 first:mt-0">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="font-display font-semibold text-sm text-fireflies-gray-800 mt-4 mb-1.5">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={i} className="text-[13px] text-fireflies-gray-600 ml-4 list-disc mb-1.5 leading-relaxed">
            {line.replace(/^[•-]\s*/, "")}
          </li>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} className="text-[13px] text-fireflies-gray-600 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {/* Fireflies-style summary toolbar */}
      <div className="px-4 py-3 border-b border-fireflies-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between gap-3">
          <button className="flex items-center gap-1.5 text-sm font-semibold text-fireflies-gray-900 hover:text-fireflies-purple transition-colors">
            <Sparkles className="w-4 h-4 text-fireflies-purple" />
            General Summary
            <ChevronDown className="w-4 h-4 text-fireflies-gray-400" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fireflies-gray-600 hover:bg-fireflies-gray-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fireflies-gray-400 cursor-not-allowed"
              title="Coming Soon"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex-1">
        {meeting.overview && (
          <p className="text-[13px] text-fireflies-gray-500 mb-4 pb-4 border-b border-fireflies-gray-100 italic">
            {meeting.overview}
          </p>
        )}

        <div>{renderSummary(meeting.summary)}</div>

        {meeting.topics.length > 0 && (
          <div className="mt-6 pt-5 border-t border-fireflies-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <List className="w-4 h-4 text-fireflies-purple" />
              <h3 className="font-display font-semibold text-sm text-fireflies-gray-900">Outline</h3>
            </div>
            <div className="space-y-0.5">
              {meeting.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => onSeek(topic.start_time)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-fireflies-purple-light/50 transition-colors text-left group"
                >
                  <span className="text-[11px] font-mono text-fireflies-purple font-semibold shrink-0 w-10">
                    {formatTimestamp(topic.start_time)}
                  </span>
                  <span className="text-[13px] text-fireflies-gray-700 group-hover:text-fireflies-purple transition-colors truncate">
                    {topic.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-fireflies-gray-100">
          <ActionItemsList items={meeting.action_items} meetingId={meeting.id} onUpdate={onUpdate} />
        </div>
      </div>
    </div>
  );
}
