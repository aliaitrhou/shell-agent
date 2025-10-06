import Redis from "ioredis";
import { spawn } from "child_process";
import { prisma } from "@/lib/prisma";

const redis = new Redis(); // defaults to localhost:6379
const sub = new Redis(); // separate client for pub/sub

export async function getContainer(sessionId: string): Promise<string | null> {
  return await redis.get(`container:${sessionId}`);
}

export async function setContainer(
  sessionId: string,
  containerId: string,
): Promise<void> {
  await redis.set(`container:${sessionId}`, containerId, "EX", 30 * 60); // expires in 30 minutes
}

export async function removeContainer(sessionId: string): Promise<void> {
  const containerId = await redis.get(`container:${sessionId}`);
  if (containerId) {
    cleanupContainer(containerId);
    await redis.del(`container:${sessionId}`);
  }
}

export async function getSessionTTL(sessionId: string): Promise<number> {
  const ttl = await redis.ttl(`container:${sessionId}`);
  return ttl > 0 ? ttl : 0; // Return 0 if key doesn't exist or has no expiry
}

function cleanupContainer(containerId: string): void {
  spawn("docker", ["stop", containerId]);
}

async function setupExpirationListener() {
  await sub.psubscribe("__keyevent@0__:expired");

  sub.on("pmessage", async (pattern, channel, message) => {
    if (message.startsWith("container:")) {
      const sessionId = message.replace("container:", "");
      console.log(`Session expired instantly: ${sessionId}`);
      try {
        await prisma.chat.update({
          where: { id: sessionId },
          data: { isExpired: true },
        });
        console.log(`Chat ${sessionId} closed automatically`);
      } catch (err) {
        console.error(`Failed to expire chat ${sessionId}:`, err);
      }
    }
  });
}

setupExpirationListener().catch(console.error);
