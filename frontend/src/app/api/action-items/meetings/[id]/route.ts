import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const meetingId = Number(params.id);
  if (isNaN(meetingId)) {
    return NextResponse.json({ detail: "Invalid meeting ID" }, { status: 400 });
  }
  const body = await request.json();
  const created = serverStore.createActionItem(meetingId, body);
  if (!created) {
    return NextResponse.json({ detail: "Meeting not found" }, { status: 404 });
  }
  return NextResponse.json(created, { status: 201 });
}
