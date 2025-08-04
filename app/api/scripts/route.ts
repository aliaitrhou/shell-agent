import { NextRequest } from "next/server";
import {
  createSandboxContainer,
  executeInContainer,
} from "@/lib/docker/user-session-setup";
import { getContainer, setContainer } from "@/lib/docker/session-store";

export async function POST(req: NextRequest) {
  try {
    const {
      action,
      filename,
      content,
      cwd = "/home/user",
      sessionId,
    } = await req.json();

    console.log("chat id:", sessionId);

    // Get or create container (reuse existing logic)
    let containerId = getContainer(sessionId);

    if (!containerId) {
      containerId = await createSandboxContainer("--memory=256m", "--cpus=1.0");
      // @ts-ignore sessionId is string
      setContainer(sessionId, containerId);
    }

    console.log("containter id (scripts) :", containerId);

    switch (action) {
      case "save":
        const saved = await saveScript(containerId, filename, content, cwd);
        return Response.json({
          success: saved,
          message: saved ? "Script saved" : "Failed to save script",
        });

      case "run":
        // Only allow bash scripts
        if (!filename.endsWith(".sh")) {
          return Response.json({
            success: false,
            error:
              "Only bash scripts (.sh) are allowed on this OS learning platform",
          });
        }

        // Check if file is executable
        const permResult = await executeInContainer(
          containerId,
          `test -x ${filename}`,
          cwd,
        );
        if (permResult.exitCode !== 0) {
          return Response.json({
            success: false,
            error: `Script is not executable. Run: chmod +x ${filename}`,
          });
        }

        const result = await executeInContainer(
          containerId,
          `./${filename}`,
          cwd,
        );
        return Response.json({
          success: result.exitCode === 0,
          output: result.output,
          exitCode: result.exitCode,
        });

      case "read":
        const readResult = await executeInContainer(
          containerId,
          `cat ${filename}`,
          cwd,
        );
        return Response.json({
          success: readResult.exitCode === 0,
          content: readResult.output,
        });

      default:
        return Response.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Script API error:", error);
    return Response.json(
      {
        success: false,
        error: "Script operation failed",
      },
      { status: 500 },
    );
  }
}

async function saveScript(
  containerId: string,
  filename: string,
  content: string,
  cwd: string,
): Promise<boolean> {
  // Add shebang if not present for .sh files
  const finalContent =
    filename.endsWith(".sh") && !content.startsWith("#!")
      ? `#!/bin/bash\n${content}`
      : content;

  const result = await executeInContainer(
    containerId,
    `cat > ${filename} << 'EOF'\n${finalContent}\nEOF`,
    cwd,
  );
  return result.exitCode === 0;
}

export const runtime = "nodejs";
