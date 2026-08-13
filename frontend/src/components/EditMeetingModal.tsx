"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import type { MeetingDetail } from "@/types";
import { api } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface EditMeetingModalProps {
  meeting: MeetingDetail;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditMeetingModal({ meeting, open, onClose, onUpdated }: EditMeetingModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(meeting.title);
  const [participants, setParticipants] = useState(meeting.participants.map((p) => p.name).join(", "));
  const [date, setDate] = useState(format(new Date(meeting.date), "yyyy-MM-dd'T'HH:mm"));

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const participantList = participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      await api.updateMeeting(meeting.id, {
        title: title.trim(),
        date: new Date(date).toISOString(),
        participants: participantList,
      });
      showToast("Meeting updated successfully");
      onUpdated();
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to update meeting", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-fireflies-gray-200">
          <h2 className="font-display font-semibold text-lg">Edit Meeting</h2>
          <button onClick={onClose} className="text-fireflies-gray-400 hover:text-fireflies-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">Title</label>
            <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">Date & Time</label>
            <input
              type="datetime-local"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-fireflies-gray-700 mb-1.5">Participants</label>
            <input
              className="input-field"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Comma-separated names"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
