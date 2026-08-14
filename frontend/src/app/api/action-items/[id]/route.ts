import { NextResponse } from "next/server";
import { serverStore } from "@/lib/serverStore";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) {
    return NextResponse.json({ detail: "Invalid item ID" }, { status: 400 });
  }
  const body = await request.json();
  const updated = serverStore.updateActionItem(itemId, body);
  if (!updated) {
    return NextResponse.json({ detail: "Action item not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  if (isNaN(itemId)) {
    return NextResponse.json({ detail: "Invalid item ID" }, { status: 400 });
  }
  const deleted = serverStore.deleteActionItem(itemId);
  if (!deleted) {
    return NextResponse.json({ detail: "Action item not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Action item deleted successfully" });
}
