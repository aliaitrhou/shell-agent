import { expandTilde } from "@/utils/current-directory-tilde";
import {
  getContainer,
  getSessionTTL,
  setContainer,
} from "@/utils/docker/session-store";
import {
  createSandboxContainer,
  executeInContainer,
} from "@/utils/docker/user-session-setup";
import { NextRequest } from "next/server";

// Store active containers per session
export async function POST(req: NextRequest) {
  try {
    const { command, sessionId, cwd = "/home/user" } = await req.json();

    const workingDir = expandTilde(cwd);

    console.log("Command is : ", command)
    console.log("chat id (cmd):", sessionId);

    // Get or create container for this session
    let containerId = await getContainer(sessionId);
    console.log("containter id (cmd) :", containerId);

    if (!containerId) {
      // Create new container with limited resources and capabilities
      console.log("No container id, new container was created!");
      containerId = await createSandboxContainer();
      //NOTE: auto-cleanup after 30 minutes
      setContainer(sessionId, containerId);
    }

    // Execute command in container
    const result = await executeInContainer(containerId, command, workingDir);
    const remainingTime = await getSessionTTL(sessionId);
    console.log("remainingTime is : ", remainingTime);

    return new Response(
      JSON.stringify({
        ...result,
        sessionRemainingTime: remainingTime,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Terminal API error:", error);
    let remainingTime = 0;
    try {
      const { sessionId } = await req.json();
      remainingTime = await getSessionTTL(sessionId);
    } catch {
      // Ignore errors when trying to get session info
    }
    return new Response(
      JSON.stringify({
        error: "Command execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
        cwd: "/", // Return current directory even on error
        sessionRemainingTime: remainingTime,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const runtime = "nodejs";
