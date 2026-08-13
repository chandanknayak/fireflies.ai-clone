"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import type { MeetingListItem } from "@/types";
import { formatDuration, getInitials, cn } from "@/lib/api";

interface MeetingTableProps {
  meetings: MeetingListItem[];
}

export default function MeetingTable({ meetings }: MeetingTableProps) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-fireflies-gray-200 bg-fireflies-gray-50/80">
            <th className="text-left text-xs font-semibold text-fireflies-gray-500 uppercase tracking-wider px-5 py-3">
              Meeting
            </th>
            <th className="text-left text-xs font-semibold text-fireflies-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
              Date
            </th>
            <th className="text-left text-xs font-semibold text-fireflies-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
              Duration
            </th>
            <th className="text-left text-xs font-semibold text-fireflies-gray-500 uppercase tracking-wider px-5 py-3">
              Participants
            </th>
            <th className="text-left text-xs font-semibold text-fireflies-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
              Action Items
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-fireflies-gray-100">
          {meetings.map((meeting) => {
            const pending = meeting.action_items_count - meeting.completed_action_items_count;
            return (
              <tr key={meeting.id} className="hover:bg-fireflies-purple-light/30 transition-colors group">
                <td className="px-5 py-4">
                  <Link href={`/meetings/${meeting.id}`} className="block">
                    <p className="font-display font-semibold text-fireflies-gray-900 group-hover:text-fireflies-purple transition-colors truncate max-w-xs lg:max-w-md">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-fireflies-gray-400 mt-0.5 md:hidden">
                      {format(new Date(meeting.date), "MMM d, yyyy")} · {formatDuration(meeting.duration_seconds)}
                    </p>
                  </Link>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-fireflies-gray-600">
                    {format(new Date(meeting.date), "MMM d, yyyy")}
                  </span>
                  <p className="text-xs text-fireflies-gray-400">{format(new Date(meeting.date), "h:mm a")}</p>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-sm text-fireflies-gray-600">
                    <Clock className="w-3.5 h-3.5 text-fireflies-gray-400" />
                    {formatDuration(meeting.duration_seconds)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white"
                        style={{ backgroundColor: p.avatar_color }}
                        title={p.name}
                      >
                        {getInitials(p.name)}
                      </div>
                    ))}
                    {meeting.participants.length > 4 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-fireflies-gray-200 flex items-center justify-center text-[9px] font-medium text-fireflies-gray-600">
                        +{meeting.participants.length - 4}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  {meeting.action_items_count > 0 ? (
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        pending > 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                      )}
                    >
                      {pending > 0 ? `${pending} pending` : "All done"}
                    </span>
                  ) : (
                    <span className="text-xs text-fireflies-gray-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
