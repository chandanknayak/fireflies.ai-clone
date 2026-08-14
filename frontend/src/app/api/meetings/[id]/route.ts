import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const meetingId = Number(params.id);
  if (isNaN(meetingId)) {
    return NextResponse.json({ detail: "Invalid meeting ID" }, { status: 400 });
  }
  const meeting = serverStore.getMeeting(meetingId);
  if (!meeting) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(meeting);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const meetingId = Number(params.id);
  if (isNaN(meetingId)) {
    return NextResponse.json({ detail: "Invalid meeting ID" }, { status: 400 });
  }
  const body = await request.json();
  const updated = serverStore.updateMeeting(meetingId, body);
  if (!updated) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const meetingId = Number(params.id);
  if (isNaN(meetingId)) {
    return NextResponse.json({ detail: "Invalid meeting ID" }, { status: 400 });
  }
  const deleted = serverStore.deleteMeeting(meetingId);
  if (!deleted) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Meeting deleted successfully" });
}
