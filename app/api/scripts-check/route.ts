import { expandTilde } from "@/utils/current-directory-tilde";
import { getContainer, setContainer } from "@/utils/docker/session-store";
import {
  createSandboxContainer,
  executeScriptInContainer,
} from "@/utils/docker/user-session-setup";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, dir, sessionId } = body;

    console.log("dir is : ", dir);
    const directory = expandTilde(dir);
    console.log("directory is : ", directory);

    let containerId = await getContainer(sessionId);
    if (!containerId) {
      containerId = await createSandboxContainer();
      setContainer(sessionId, containerId);
    }

    console.log("containerId (scripts-check) : ", containerId);
    const command = `test -f "${filename}" && echo "exists" || echo "missing"`;

    const result = await executeScriptInContainer(
      containerId,
      command,
      directory,
    );

    const exists = result.output.trim() === "exists";

    return Response.json({ exists });
  } catch (err: any) {
    console.error("Error checking file existence:", err);
    return Response.json({ error: "Internal server error" });
  }
}
