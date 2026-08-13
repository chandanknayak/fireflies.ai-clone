"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Search, Plus, SlidersHorizontal, Loader2, Calendar } from "lucide-react";
import type { MeetingListItem } from "@/types";
import { api } from "@/lib/api";
import MeetingTable from "@/components/MeetingTable";
import CreateMeetingModal from "@/components/CreateMeetingModal";

type DateFilter = "all" | "today" | "week" | "month" | "quarter";

function getDateRange(filter: DateFilter): { date_from?: string; date_to?: string } {
  if (filter === "all") return {};

  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (filter === "week") start.setDate(start.getDate() - 7);
  else if (filter === "month") start.setDate(start.getDate() - 30);
  else if (filter === "quarter") start.setDate(start.getDate() - 90);

  return {
    date_from: start.toISOString(),
    date_to: end.toISOString(),
  };
}

export default function HomePage() {
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const dateRange = useMemo(() => getDateRange(dateFilter), [dateFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMeetings({
        search: debouncedSearch || undefined,
        sort_by: sortBy,
        ...dateRange,
      });
      setMeetings(data);
    } catch {
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sortBy, dateRange]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const hasFilters = search || dateFilter !== "all";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-fireflies-gray-50/80 backdrop-blur-md border-b border-fireflies-gray-200">
        <div className="px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-fireflies-gray-900">Meetings</h1>
            <p className="text-sm text-fireflies-gray-500 mt-0.5">
              {meetings.length} meeting{meetings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fireflies-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search by title or participant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-fireflies-gray-400" />
            <select
              className="input-field !w-auto pr-8"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-fireflies-gray-400" />
            <select
              className="input-field !w-auto pr-8"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date_desc">Most Recent</option>
              <option value="date_asc">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-fireflies-purple animate-spin" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-fireflies-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-fireflies-purple" />
            </div>
            <h3 className="font-display font-semibold text-lg text-fireflies-gray-900 mb-1">No meetings found</h3>
            <p className="text-sm text-fireflies-gray-500 mb-4">
              {hasFilters ? "Try adjusting your search or date filter" : "Create your first meeting to get started"}
            </p>
            {!hasFilters && (
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                Create Meeting
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            <MeetingTable meetings={meetings} />
          </div>
        )}
      </div>

      <CreateMeetingModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchMeetings} />
    </div>
  );
}
