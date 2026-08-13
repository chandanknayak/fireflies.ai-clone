"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { formatTimestamp, cn } from "@/lib/api";

interface MediaPlayerProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function MediaPlayer({
  duration,
  currentTime,
  onSeek,
  isPlaying,
  onPlayPause,
}: MediaPlayerProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (clientX: number) => {
      if (!progressRef.current || duration <= 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(ratio * duration);
    },
    [duration, onSeek]
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => handleSeek(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging, handleSeek]);

  return (
    <div className="bg-fireflies-gray-900 rounded-xl p-4 text-white">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-fireflies-purple/30 flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-fireflies-purple-light" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Meeting Recording</p>
          <p className="text-xs text-fireflies-gray-400">Audio placeholder — click transcript to seek</p>
        </div>
      </div>

      <div
        ref={progressRef}
        className="relative h-2 bg-fireflies-gray-700 rounded-full cursor-pointer group mb-3"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleSeek(e.clientX);
        }}
      >
        <div
          className="absolute h-full bg-fireflies-purple rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md transition-opacity",
            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
          style={{ left: `calc(${progress}% - 7px)` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-fireflies-gray-400 font-mono">{formatTimestamp(currentTime)}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            className="p-1.5 rounded-lg hover:bg-fireflies-gray-700 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={onPlayPause}
            className="p-2.5 rounded-full bg-fireflies-purple hover:bg-fireflies-purple-hover transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            className="p-1.5 rounded-lg hover:bg-fireflies-gray-700 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-fireflies-gray-400 font-mono">{formatTimestamp(duration)}</span>
      </div>
    </div>
  );
}
