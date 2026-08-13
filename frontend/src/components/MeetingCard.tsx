"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Clock, Users, CheckSquare } from "lucide-react";
import type { MeetingListItem } from "@/types";
import { formatDuration, getInitials, cn } from "@/lib/api";

interface MeetingCardProps {
  meeting: MeetingListItem;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const pendingActions = meeting.action_items_count - meeting.completed_action_items_count;

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="card p-5 hover:shadow-md hover:border-fireflies-purple/30 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-fireflies-gray-900 group-hover:text-fireflies-purple transition-colors truncate">
              {meeting.title}
            </h3>
            <p className="text-sm text-fireflies-gray-500 mt-1">
              {format(new Date(meeting.date), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="flex -space-x-2 shrink-0">
            {meeting.participants.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ backgroundColor: p.avatar_color }}
                title={p.name}
              >
                {getInitials(p.name)}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-fireflies-gray-200 flex items-center justify-center text-[10px] font-medium text-fireflies-gray-600">
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-xs text-fireflies-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDuration(meeting.duration_seconds)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {meeting.participants.length} participants
          </span>
          {meeting.action_items_count > 0 && (
            <span className={cn("flex items-center gap-1.5", pendingActions > 0 && "text-orange-600")}>
              <CheckSquare className="w-3.5 h-3.5" />
              {pendingActions > 0
                ? `${pendingActions} action item${pendingActions > 1 ? "s" : ""}`
                : "All tasks done"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
