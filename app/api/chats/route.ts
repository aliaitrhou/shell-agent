import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // If user doesn't exist, create one
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId },
    });

    await prisma.chat.create({
      data: {
        userId: user.id,
        name: "First Chat",
      },
    });
  } else {
    const chats = await prisma.chat.findMany({
      where: { userId: user.id },
    });

    // If no chats exist, create a default chat
    if (chats.length === 0) {
      await prisma.chat.create({
        data: {
          userId: user.id,
          name: "First Chat",
        },
      });
    }
  }

  // Refetch updated chats
  const updatedChats = await prisma.chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { messages: true },
      },
    },
  });

  const formattedChats = updatedChats.map((chat) => ({
    id: chat.id,
    createdAt: chat.createdAt,
    name: chat.name,
    messageCount: chat._count.messages,
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

  // Create a new chat with the provided name and the user's id
  const chat = await prisma.chat.create({
    data: {
      userId: user.id, // Ensure using the `user.id`, not clerkId directly
      name,
    },
  });

  return NextResponse.json(chat);
}

// Delete a chat by id
export async function DELETE(request: NextRequest) {
  console.log("Delete method function handler is runing!!");
  const { chatId } = await request.json();

  if (!chatId) {
    return NextResponse.json({ error: "Chat id is missing" }, { status: 404 });
  }

  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Delelte chat API Route - chatID is: ", chatId);

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

  return NextResponse.json({ message: "Chat deleted successfully" });
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
