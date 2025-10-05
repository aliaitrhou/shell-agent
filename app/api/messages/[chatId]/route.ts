// endpoint to be used to retrieve messages from a chat based on a provided chatId.
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const { chatId } = await params;
  console.log("chatId is : ", chatId);

  // check if the chat exists
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
  });

  if (!chat)
    return Response.json({ error: "Invalid chat ID" }, { status: 404 });

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    select: {
      role: true,
      text: true,
      cwd: true,
      mode: true,
      pageNumber: true,
      chapterName: true,
      containerExpiry: true,
    },
  });

  return Response.json(messages);
}
