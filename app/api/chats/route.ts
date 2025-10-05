import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure the user exists (but don't create chats here)
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { clerkId },
    });
  }

  const chats = await prisma.chat.findMany({ where: { userId: user.id } });
  // If user has no chats, create the first one
  if (chats.length === 0) {
    await prisma.chat.create({
      data: { userId: user.id, name: "First Tab" },
    });
  }

  // Fetch chats only
  const newChats = await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  const formattedChats = newChats.map((chat) => ({
    id: chat.id,
    createdAt: chat.createdAt,
    name: chat.name,
    closedTab: chat.isExpired,
  }));

  return NextResponse.json(formattedChats);
}

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // chat name
  const { name } = await request.json();

  // ensure the user exists or create one
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  // Count how many chats the user already has
  const chatCount = await prisma.chat.count({
    where: { userId: user.id },
  });

  if (chatCount >= 6) {
    return NextResponse.json({
      message: "You can only create up to 6 chats.",
      children: `<Link href="user-guide#limitations">Learn more</Link>`,
      status: "error",
      chat: null,
    });
  }

  // Create a new chat with the provided name and the user's id
  const chat = await prisma.chat.create({
    data: {
      userId: user.id, // Ensure using the `user.id`, not clerkId directly
      name,
    },
  });
  return NextResponse.json({
    message: "Chat created successfully.",
    status: "success",
    chat,
  });
}

// Delete a chat by id
export async function DELETE(request: NextRequest) {
  const { chatId } = await request.json();

  if (!chatId) {
    return NextResponse.json({ error: "Chat id is missing" }, { status: 404 });
  }

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });

  if (!chat || chat.userId !== user.id) {
    return NextResponse.json(
      { error: "Chat not found or unauthorized" },
      { status: 403 },
    );
  }

  await prisma.chat.delete({ where: { id: chatId } });
  return NextResponse.json({
    message: "Chat deleted successfully.",
    status: "success",
  });
}

export async function PATCH(request: NextRequest) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatId, newName } = await request.json();

  if (!chatId || !newName) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });

  if (!chat || chat.userId !== user.id) {
    return NextResponse.json(
      { error: "Chat not found or unauthorized" },
      { status: 403 },
    );
  }

  const updatedChat = await prisma.chat.update({
    where: { id: chatId },
    data: { name: newName },
  });

  return NextResponse.json(updatedChat);
}
