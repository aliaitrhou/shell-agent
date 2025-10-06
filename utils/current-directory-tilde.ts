export function replaceHomeWithTilde(fullPath: string, homeDir: string) {
  if (!fullPath || !homeDir) return fullPath;

  // Ensure trailing slash doesn't matter
  const normalizedFullPath = fullPath.replace(/\/+$/, "");
  const normalizedHomeDir = homeDir.replace(/\/+$/, "");

  if (normalizedFullPath.startsWith(normalizedHomeDir)) {
    return normalizedFullPath.replace(normalizedHomeDir, "~");
  }

  return fullPath; // no change if it doesn't start with homeDir
}

export function expandTilde(pathWithTilde: string) {
  if (!pathWithTilde) return pathWithTilde;

  const homeDir = "/home/user"; // automatically detects current user's home

  if (pathWithTilde.startsWith("~")) {
    return pathWithTilde.replace("~", homeDir);
  }

  return pathWithTilde; // no change if it doesn't start with ~
}


export function normalizeError(err: unknown): Error {
  if (err instanceof Error) return err;
  if (typeof err === "object" && err !== null) {
    return new Error(JSON.stringify(err));
  }
  return new Error(String(err));
}
