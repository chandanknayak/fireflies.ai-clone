import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const sort_by = searchParams.get("sort_by") || "date_desc";
  const date_from = searchParams.get("date_from") || undefined;
  const date_to = searchParams.get("date_to") || undefined;

  const meetings = serverStore.getMeetings({ search, sort_by, date_from, date_to });
  return NextResponse.json(meetings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const meeting = serverStore.createMeeting(body);
    return NextResponse.json(meeting, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: "Failed to create meeting" }, { status: 400 });
  }
}
