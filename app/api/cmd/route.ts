import { NextRequest } from "next/server";
import {
  createSandboxContainer,
  executeInContainer,
} from "@/lib/docker/user-session-setup";
import { getContainer, setContainer } from "@/lib/docker/session-store";

// Store active containers per session

export async function POST(req: NextRequest) {
  try {
    const { command, sessionId, cwd = "/" } = await req.json();

    console.log("chat id:", sessionId);

    // Get or create container for this session
    let containerId = getContainer(sessionId);

    if (!containerId) {
      // Create new container with limited resources and capabilities
      containerId = await createSandboxContainer();
      //NOTE: auto-cleanup after 30 minutes
      setContainer(sessionId, containerId);
    }

    console.log("containter id (cmd) :", containerId);

    // Execute command in container
    const result = await executeInContainer(containerId, command, cwd);

    console.log("Execution result:", result);

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Terminal API error:", error);
    return new Response(
      JSON.stringify({
        error: "Command execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
        cwd: "/", // Return current directory even on error
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const runtime = "nodejs";
