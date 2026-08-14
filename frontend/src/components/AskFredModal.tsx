"use client";

import { useState } from "react";
import { Sparkles, Send, X, Bot, User } from "lucide-react";
import type { MeetingDetail } from "@/types";

interface AskFredModalProps {
  meeting: MeetingDetail;
  open: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: "user" | "fred";
  text: string;
}

export default function AskFredModal({ meeting, open, onClose }: AskFredModalProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "fred",
      text: `Hi! I'm Fred, your Fireflies AI assistant. Ask me anything about "${meeting.title}"!`,
    },
  ]);
  const [thinking, setThinking] = useState(false);

  if (!open) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setQuery("");
    setThinking(true);

    setTimeout(() => {
      let answer = "";
      const lower = userText.toLowerCase();
      if (lower.includes("action") || lower.includes("task") || lower.includes("todo")) {
        const itemTitles = meeting.action_items.map((a) => `• ${a.title} (Assignee: ${a.assignee || "Unassigned"})`).join("\n");
        answer = `Here are the action items from this meeting:\n\n${itemTitles || "No action items recorded."}`;
      } else if (lower.includes("participant") || lower.includes("who") || lower.includes("attendee")) {
        const names = meeting.participants.map((p) => p.name).join(", ");
        answer = `Participants in this meeting were: ${names}.`;
      } else if (lower.includes("summary") || lower.includes("about") || lower.includes("overview")) {
        answer = meeting.overview || meeting.summary.slice(0, 300) + "...";
      } else {
        const matchingSeg = meeting.transcript_segments.find((s) => s.text.toLowerCase().includes(lower));
        if (matchingSeg) {
          answer = `Based on the transcript, ${matchingSeg.speaker_name} mentioned: "${matchingSeg.text}"`;
        } else {
          answer = `Based on the meeting transcript for "${meeting.title}", the team discussed ${meeting.overview.toLowerCase()}. Feel free to ask about key decisions, participants, or action items!`;
        }
      }

      setMessages((prev) => [...prev, { sender: "fred", text: answer }]);
      setThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-fireflies-gray-200 flex items-center justify-between bg-gradient-to-r from-fireflies-purple/10 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-fireflies flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-fireflies-gray-900">AskFred AI</h3>
              <p className="text-[11px] text-fireflies-gray-500">Ask anything about this meeting</p>
            </div>
          </div>
          <button onClick={onClose} className="text-fireflies-gray-400 hover:text-fireflies-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-fireflies-gray-50/50">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "fred" && (
                <div className="w-7 h-7 rounded-full bg-fireflies-purple/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-fireflies-purple" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-fireflies-purple text-white rounded-br-none"
                    : "bg-white text-fireflies-gray-800 border border-fireflies-gray-200 shadow-sm rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              {m.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-fireflies-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-fireflies-gray-600" />
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="flex items-center gap-2 text-xs text-fireflies-gray-400 italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-fireflies-purple" />
              Fred is thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-fireflies-gray-200 flex gap-2">
          <input
            className="input-field flex-1 text-xs"
            placeholder="Ask a question about this meeting..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={thinking || !query.trim()} className="btn-primary !px-3.5 !py-2">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
