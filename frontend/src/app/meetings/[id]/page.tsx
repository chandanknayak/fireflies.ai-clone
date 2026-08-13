"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  MoreHorizontal,
  Clock,
  Users,
  Trash2,
  Pencil,
  Loader2,
  FileText,
  Video,
  Scissors,
} from "lucide-react";
import type { MeetingDetail } from "@/types";
import { api, formatDuration, cn } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import MediaPlayer from "@/components/MediaPlayer";
import TranscriptViewer from "@/components/TranscriptViewer";
import SummaryPanel from "@/components/SummaryPanel";
import EditMeetingModal from "@/components/EditMeetingModal";
import NotepadIconRail from "@/components/NotepadIconRail";

type NotepadTab = "notes" | "video" | "soundbites";

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const meetingId = Number(params.id);

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [notepadTab, setNotepadTab] = useState<NotepadTab>("notes");
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMeeting = useCallback(async () => {
    try {
      const data = await api.getMeeting(meetingId);
      setMeeting(data);
    } catch {
      showToast("Meeting not found", "error");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [meetingId, router, showToast]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  useEffect(() => {
    if (isPlaying && meeting) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= meeting.duration_seconds) {
            setIsPlaying(false);
            return meeting.duration_seconds;
          }
          return prev + 0.5;
        });
      }, 500);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, meeting]);

  const speakerColors = useMemo(() => {
    if (!meeting) return {};
    const colors: Record<string, string> = {};
    meeting.participants.forEach((p) => {
      colors[p.name] = p.avatar_color;
    });
    meeting.transcript_segments.forEach((s) => {
      if (!colors[s.speaker_name]) colors[s.speaker_name] = "#7635FF";
    });
    return colors;
  }, [meeting]);

  const handleSeek = (time: number) => setCurrentTime(time);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await api.deleteMeeting(meetingId);
      showToast("Meeting deleted");
      router.push("/");
    } catch {
      showToast("Failed to delete meeting", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-fireflies-purple animate-spin" />
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="min-h-screen flex flex-col bg-fireflies-gray-50">
      {/* Notepad header */}
      <header className="sticky top-0 z-20 bg-white border-b border-fireflies-gray-200">
        <div className="px-5 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/")} className="btn-ghost !p-2 shrink-0" title="Back to Notebook">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-lg text-fireflies-gray-900 truncate">{meeting.title}</h1>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-fireflies-gray-500">
              <span>{format(new Date(meeting.date), "MMM d, yyyy · h:mm a")}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDuration(meeting.duration_seconds)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {meeting.participants.length} participants
              </span>
            </div>
          </div>
          <div className="relative shrink-0">
            <button onClick={() => setShowMenu(!showMenu)} className="btn-ghost !p-2">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-fireflies-gray-200 py-1 z-20">
                  <button
                    onClick={() => { setShowEdit(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-fireflies-gray-700 hover:bg-fireflies-gray-50"
                  >
                    <Pencil className="w-4 h-4" /> Edit Meeting
                  </button>
                  <button
                    onClick={() => { handleDelete(); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Meeting
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fireflies notepad tabs */}
        <div className="flex px-5 border-t border-fireflies-gray-100">
          <button
            onClick={() => setNotepadTab("notes")}
            className={cn("notepad-tab flex items-center gap-2", notepadTab === "notes" ? "notepad-tab-active" : "notepad-tab-inactive")}
          >
            <FileText className="w-4 h-4" /> Notes
          </button>
          <button
            onClick={() => setNotepadTab("video")}
            className={cn("notepad-tab flex items-center gap-2", notepadTab === "video" ? "notepad-tab-active" : "notepad-tab-inactive")}
          >
            <Video className="w-4 h-4" /> Video
          </button>
          <button
            onClick={() => setNotepadTab("soundbites")}
            className={cn("notepad-tab flex items-center gap-2", notepadTab === "soundbites" ? "notepad-tab-active" : "notepad-tab-inactive")}
          >
            <Scissors className="w-4 h-4" /> Soundbites
          </button>
        </div>
      </header>

      {notepadTab === "notes" && (
        <>
          <div className="px-5 py-3 bg-white border-b border-fireflies-gray-200">
            <MediaPlayer
              duration={meeting.duration_seconds}
              currentTime={currentTime}
              onSeek={handleSeek}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
          </div>

          <div className="flex-1 flex overflow-hidden min-h-[calc(100vh-180px)]">
            <NotepadIconRail />

            {/* Summary — left panel */}
            <div className="w-full lg:w-[45%] border-r border-fireflies-gray-200 overflow-hidden bg-white">
              <SummaryPanel meeting={meeting} onSeek={handleSeek} onUpdate={fetchMeeting} />
            </div>

            {/* Transcript — right panel */}
            <div className="hidden lg:flex lg:w-[55%] flex-col overflow-hidden bg-white">
              <div className="px-4 py-3 border-b border-fireflies-gray-200">
                <h2 className="font-display font-semibold text-sm text-fireflies-gray-900">Transcript</h2>
                <p className="text-xs text-fireflies-gray-400">{meeting.transcript_segments.length} segments</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <TranscriptViewer
                  segments={meeting.transcript_segments}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  searchQuery={transcriptSearch}
                  onSearchChange={setTranscriptSearch}
                  speakerColors={speakerColors}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {notepadTab === "video" && (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 gradient-fireflies rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-display font-semibold text-lg text-fireflies-gray-900 mb-2">Video Recording</h3>
            <p className="text-sm text-fireflies-gray-500">Video playback coming soon. Use the audio player in the Notes tab to navigate the transcript.</p>
          </div>
        </div>
      )}

      {notepadTab === "soundbites" && (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-fireflies-purple-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-fireflies-purple" />
            </div>
            <h3 className="font-display font-semibold text-lg text-fireflies-gray-900 mb-2">Soundbites</h3>
            <p className="text-sm text-fireflies-gray-500">Clip and share important moments from your meeting. Coming soon.</p>
          </div>
        </div>
      )}

      <EditMeetingModal meeting={meeting} open={showEdit} onClose={() => setShowEdit(false)} onUpdated={fetchMeeting} />
    </div>
  );
}
