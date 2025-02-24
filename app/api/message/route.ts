// this endpoint handles a POST request that adds a new message to a messages table.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { chatId, text, role } = await req.json();
  if (!chatId || !text || !role)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat)
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });

  const message = await prisma.message.create({
    data: { chatId, role, text },
  });

  return NextResponse.json(message);
}
