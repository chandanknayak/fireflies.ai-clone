"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface CreateMeetingModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateMeetingModal({ open, onClose, onCreated }: CreateMeetingModalProps) {
  const { showToast } = useToast();
  const [tab, setTab] = useState<"form" | "transcript">("form");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState("");
  const [transcript, setTranscript] = useState("");
  const [transcriptTitle, setTranscriptTitle] = useState("");

  if (!open) return null;

  const reset = () => {
    setTitle("");
    setParticipants("");
    setTranscript("");
    setTranscriptTitle("");
    setTab("form");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      const participantList = participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      await api.createMeeting({
        title: title.trim(),
        date: new Date().toISOString(),
        participants: participantList,
      });
      showToast("Meeting created successfully");
      reset();
      onCreated();
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create meeting", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTranscriptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      await api.uploadTranscript({
        transcript_text: transcript.trim(),
        title: transcriptTitle.trim() || undefined,
        date: new Date().toISOString(),
      });
      showToast("Meeting created from transcript");
      reset();
      onCreated();
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to parse transcript", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-fireflies-gray-200">
          <h2 className="font-display font-semibold text-lg">Create Meeting</h2>
          <button onClick={handleClose} className="text-fireflies-gray-400 hover:text-fireflies-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-fireflies-gray-200">
          <button
            onClick={() => setTab("form")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "form" ? "text-fireflies-purple border-b-2 border-fireflies-purple" : "text-fireflies-gray-500"
            }`}
          >
            New Meeting
          </button>
          <button
            onClick={() => setTab("transcript")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "transcript" ? "text-fireflies-purple border-b-2 border-fireflies-purple" : "text-fireflies-gray-500"
            }`}
          >
            Upload Transcript
          </button>
        </div>

        <div className="p-6">
          {tab === "form" ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">Meeting Title</label>
                <input
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly Standup"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">
                  Participants (comma-separated)
                </label>
                <input
                  className="input-field"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="e.g. John Doe, Jane Smith"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Creating..." : "Create Meeting"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTranscriptSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">Title (optional)</label>
                <input
                  className="input-field"
                  value={transcriptTitle}
                  onChange={(e) => setTranscriptTitle(e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">Transcript</label>
                <textarea
                  className="input-field min-h-[200px] font-mono text-xs"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={`Paste transcript in format:\n\nSarah Chen: Good morning everyone.\nMike Johnson: Let's review the roadmap.\n\nOr with timestamps:\n[0:00 - 0:15] Sarah Chen: Good morning everyone.`}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={handleClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Processing..." : "Create from Transcript"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
