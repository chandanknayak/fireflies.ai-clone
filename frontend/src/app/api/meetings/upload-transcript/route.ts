import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

function parseTranscriptText(text: string): { speaker: string; text: string }[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const segments: { speaker: string; text: string }[] = [];
  for (const line of lines) {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const speaker = parts[0].replace(/^\[.*?\]\s*/, "").trim();
      const content = parts.slice(1).join(":").trim();
      segments.push({ speaker: speaker || "Unknown", text: content });
    } else {
      segments.push({ speaker: "Unknown", text: line });
    }
  }
  return segments;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcriptText = body.transcript_text || "";
    if (!transcriptText.trim()) {
      return NextResponse.json({ detail: "Transcript text is required" }, { status: 400 });
    }

    const parsed = parseTranscriptText(transcriptText);
    const speakers = Array.from(new Set(parsed.map((p) => p.speaker)));

    const meetingData = {
      title: body.title || `Transcript Upload - ${new Date().toLocaleDateString()}`,
      date: body.date || new Date().toISOString(),
      duration_seconds: parsed.length * 15,
      summary: `## AI Summary from Uploaded Transcript\n\nParsed ${parsed.length} transcript lines across ${speakers.length} participants: ${speakers.join(", ")}.`,
      overview: `Auto-generated summary from uploaded transcript.`,
      participants: speakers.map((s) => ({ name: s })),
      transcript_segments: parsed.map((p, idx) => ({
        speaker_name: p.speaker,
        start_time: idx * 15,
        end_time: (idx + 1) * 15,
        text: p.text,
      })),
      action_items: [
        { title: "Review uploaded transcript summary", assignee: speakers[0] || "Team", completed: false },
      ],
      topics: [
        { title: "Transcript Discussion", start_time: 0, end_time: parsed.length * 15 },
      ],
    };

    const created = serverStore.createMeeting(meetingData);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: "Failed to parse transcript" }, { status: 400 });
  }
}
