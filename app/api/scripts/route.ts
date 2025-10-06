import { NextRequest } from "next/server";
import {
  createSandboxContainer,
  executeInContainer,
  executeScriptInContainer,
} from "@/utils/docker/user-session-setup";

import {
  getContainer,
  getSessionTTL,
  setContainer,
} from "@/utils/docker/session-store";
import { expandTilde } from "@/utils/current-directory-tilde";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, cwd = "/home/user", sessionId } = body;

    const workingDir = expandTilde(cwd);

    console.log("chat id (scripts):", sessionId);

    // Get or create container
    let containerId = await getContainer(sessionId);
    if (!containerId) {
      containerId = await createSandboxContainer();
      setContainer(sessionId, containerId);
    }

    const remainingTime = await getSessionTTL(sessionId);

    switch (action) {
      case "save": {
        if (!body.filename || !body.content) {
          return Response.json(
            { success: false, error: "filename and content are required" },
            { status: 400 },
          );
        }

        const saved = await saveScript(
          containerId,
          body.filename,
          body.content,
          workingDir,
        );

        return Response.json({
          success: saved,
          message: saved ? "Script saved" : "Failed to save script",
          sessionRemainingTime: remainingTime,
        });
      }

      case "run": {
        if (!body.filename) {
          return Response.json(
            { success: false, error: "filename is required" },
            { status: 400 },
          );
        }

        // .txt files not executable
        if (!body.filename.endsWith(".sh")) {
          return Response.json({
            success: false,
            output: "File type not exectuable",
          });
        }

        if (
          body.filename.endsWith(".sh") &&
          body.content &&
          !body.content.trim().startsWith("#!/bin/bash")
        ) {
          // Add shebang if not present
          return Response.json({
            success: false,
            output: "Missing script shebang!",
          });
        }

        const filename = body.filename;
        console.log("Running bash script:", filename);

        // Check if file exists first using our specialized function
        const fileCheck = await executeScriptInContainer(
          containerId,
          `test -f "${filename}" && echo "exists" || echo "not found"`,
          workingDir,
        );

        console.log("fileCheck: ", fileCheck);

        if (body.content) {
          const insert = await saveScript(
            containerId,
            body.filename,
            body.content,
            workingDir,
          );
          console.log("insert: ", insert);
        }

        if (!fileCheck.output.includes("exists")) {
          return Response.json({
            success: false,
            output: `Script '${filename}' not found. Please save it first.`,
            sessionRemainingTime: remainingTime,
          });
        }

        // Run the script using our specialized function
        const result = await executeScriptInContainer(
          containerId,
          `bash "${filename}"`,
          workingDir,
        );

        console.log("Script execution result:", result);

        return Response.json({
          success: result.exitCode === 0,
          output:
            result.output ||
            (result.exitCode === 0
              ? "Script executed successfully (no output)"
              : "Script failed"),
          exitCode: result.exitCode,
          sessionRemainingTime: remainingTime,
        });
      }
      case "read": {
        if (!body.filename) {
          return Response.json(
            { success: false, error: "filename is required" },
            { status: 400 },
          );
        }

        const readResult = await executeInContainer(
          containerId,
          `cat ${body.filename}`,
          workingDir,
        );

        return Response.json({
          success: readResult.exitCode === 0,
          content: readResult.output,
          sessionRemainingTime: remainingTime,
        });
      }

      default:
        return Response.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Script API error:", error);
    return Response.json(
      { success: false, error: "Script operation failed" },
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
  try {
    const finalContent = content;

    // Use our specialized function to save the file
    const result = await executeScriptInContainer(
      containerId,
      `cat > "${filename}" << 'SCRIPT_EOF'
${finalContent}
SCRIPT_EOF`,
      cwd,
    );

    if (result.exitCode === 0) {
      // Verify the file was created
      const verifyResult = await executeScriptInContainer(
        containerId,
        `test -f "${filename}" && echo "created" || echo "failed"`,
        cwd,
      );
      return verifyResult.output.includes("created");
    }

    return false;
  } catch (error) {
    console.error("Error saving bash script:", error);
    return false;
  }
}

export const runtime = "nodejs";
