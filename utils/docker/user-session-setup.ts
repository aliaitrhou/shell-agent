import { spawn } from "child_process";
import { resolvePath, sanitizeCommand } from "./security";

export async function createSandboxContainer(
  memory = "--memory=200m",
  cpus = "--cpus=0.5",
): Promise<string> {
  return new Promise((resolve, reject) => {
    const dockerRun = spawn("docker", [
      "run",
      "-d", // Detached mode
      "--rm", // Auto-remove when stopped
      memory, // Limit memory
      cpus, // Limit CPU
      "--network=none", // No network access
      "--read-only", // Read-only filesystem
      "--tmpfs=/tmp:rw,size=50m", // Writable tmp with size limit
      "--tmpfs=/home/user:rw,size=50m", // Writable home directory
      "--security-opt=no-new-privileges", // Prevent privilege escalation
      "--cap-drop=ALL", // Drop all capabilities
      "--user=1000:1000", // Run as non-root user
      "ubuntu:22.04", // Base image
      "sleep",
      "1800", // Keep alive for 30 minutes
    ]);

    let containerId = "";

    dockerRun.stdout.on("data", (data) => {
      containerId += data.toString().trim();
    });

    dockerRun.on("close", (code) => {
      if (code === 0 && containerId) {
        resolve(containerId);
      } else {
        reject(new Error(`Failed to create container: ${code}`));
      }
    });
  });
}

export async function executeInContainer(
  containerId: string,
  command: string,
  cwd: string,
): Promise<{
  output: string;
  cwd: string;
  exitCode: number;
  isDirectoryChange: boolean;
}> {
  return new Promise((resolve) => {
    // Sanitize and validate command
    const sanitizedCommand = sanitizeCommand(command);
    if (!sanitizedCommand) {
      resolve({
        output: "bash: command not allowed or invalid",
        cwd,
        exitCode: 1,
        isDirectoryChange: false,
      });
      return;
    }

    // Check if this is a directory change command
    const isCdCommand = sanitizedCommand.trim().startsWith("cd ");

    const dockerExec = spawn("docker", [
      "exec",
      "-w",
      cwd, // Set working directory
      "-i", // Interactive
      containerId,
      "bash",
      "-c",
      // For cd commands, also return the new working directory
      isCdCommand ? `${sanitizedCommand} && pwd` : sanitizedCommand,
    ]);

    let output = "";
    let errorOutput = "";

    dockerExec.stdout.on("data", (data) => {
      output += data.toString();
    });

    dockerExec.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    dockerExec.on("close", (code) => {
      let newCwd = cwd;
      let finalOutput = output || errorOutput || "";

      // Handle cd command specially to update cwd
      if (isCdCommand && code === 0) {
        // Extract the new directory from pwd output
        const lines = output.trim().split("\n");
        const pwdOutput = lines[lines.length - 1].trim();

        if (pwdOutput && pwdOutput.startsWith("/")) {
          newCwd = pwdOutput;
          // Remove the pwd output from the displayed output
          finalOutput = lines.slice(0, -1).join("\n");
        } else {
          // Fallback to manual path resolution
          const cdPath = sanitizedCommand.trim().substring(3).trim();
          newCwd = resolvePath(cwd, cdPath);
        }
      }

      resolve({
        output: finalOutput,
        cwd: newCwd,
        exitCode: code || 0,
        isDirectoryChange: isCdCommand && code === 0,
      });
    });

    // Set timeout for long-running commands
    setTimeout(() => {
      dockerExec.kill();
      resolve({
        output: "Command timeout after 30 seconds",
        cwd,
        exitCode: 124,
        isDirectoryChange: false,
      });
    }, 20000);
  });
}

export async function executeScriptInContainer(
  containerId: string,
  command: string,
  cwd: string,
): Promise<{
  output: string;
  cwd: string;
  exitCode: number;
  isDirectoryChange: boolean;
}> {
  return new Promise((resolve) => {
    const dockerExec = spawn("docker", [
      "exec",
      "-w",
      cwd, // Set working directory
      "-i", // Interactive
      containerId,
      "bash",
      "-c",
      command, // Execute command directly without security filtering
    ]);

    let output = "";
    let errorOutput = "";

    dockerExec.stdout.on("data", (data) => {
      output += data.toString();
    });

    dockerExec.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    dockerExec.on("close", (code) => {
      resolve({
        output: output || errorOutput || "",
        cwd,
        exitCode: code || 0,
        isDirectoryChange: false,
      });
    });

    // Set timeout for long-running commands
    setTimeout(() => {
      dockerExec.kill();
      resolve({
        output: "Command timeout after 30 seconds",
        cwd,
        exitCode: 124,
        isDirectoryChange: false,
      });
    }, 30000);
  });
}
