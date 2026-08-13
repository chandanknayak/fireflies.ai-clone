"use client";

import { useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import type { TranscriptSegment } from "@/types";
import { formatTimestamp, getInitials, cn } from "@/lib/api";

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  speakerColors: Record<string, string>;
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="highlight-match">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function TranscriptViewer({
  segments,
  currentTime,
  onSeek,
  searchQuery,
  onSearchChange,
  speakerColors,
}: TranscriptViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter(
      (s) => s.text.toLowerCase().includes(q) || s.speaker_name.toLowerCase().includes(q)
    );
  }, [segments, searchQuery]);

  const activeSegmentId = useMemo(() => {
    const active = segments.find((s) => currentTime >= s.start_time && currentTime < s.end_time);
    return active?.id;
  }, [segments, currentTime]);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (elRect.top < containerRect.top || elRect.bottom > containerRect.bottom) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeSegmentId]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-fireflies-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fireflies-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Search in transcript..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fireflies-gray-400">
              {filteredSegments.length} match{filteredSegments.length !== 1 ? "es" : ""}
            </span>
          )}
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-2 py-2">
        {filteredSegments.length === 0 ? (
          <div className="text-center py-12 text-fireflies-gray-400 text-sm">No matching segments found</div>
        ) : (
          filteredSegments.map((segment) => {
            const isActive = segment.id === activeSegmentId;
            const color = speakerColors[segment.speaker_name] || "#6C5CE7";

            return (
              <div
                key={segment.id}
                ref={isActive ? activeRef : undefined}
                onClick={() => onSeek(segment.start_time)}
                className={cn(
                  "flex gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 hover:bg-fireflies-gray-50",
                  isActive && "transcript-segment-active"
                )}
              >
                <div className="shrink-0 pt-0.5">
                  <span className="text-xs font-mono text-fireflies-purple font-medium">
                    {formatTimestamp(segment.start_time)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {getInitials(segment.speaker_name)}
                    </div>
                    <span className="text-sm font-semibold text-fireflies-gray-800">{segment.speaker_name}</span>
                  </div>
                  <p className="text-sm text-fireflies-gray-600 leading-relaxed">
                    {highlightText(segment.text, searchQuery)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
