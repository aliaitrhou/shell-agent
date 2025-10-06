export function validateSpecificCommand(
  cmd: string,
  fullCommand: string,
): boolean {
  const args = fullCommand.trim().split(/\s+/).slice(1);

  switch (cmd) {
    case "rm":
      // Allow -r flag but with restrictions
      const hasRecursiveFlag = args.some((arg) => arg.includes("-r"));
      const hasDangerousFlags = args.some((arg) => arg.includes("-f"));

      // Block -f flag completely (force removal)
      if (hasDangerousFlags) {
        return false;
      }

      // If using -r flag, check the paths
      if (hasRecursiveFlag) {
        const paths = args.filter((arg) => !arg.startsWith("-"));

        // Block removal of root and system directories
        if (
          paths.some(
            (path) =>
              path === "/" ||
              path.startsWith("/bin") ||
              path.startsWith("/usr") ||
              path.startsWith("/etc") ||
              path.startsWith("/var") ||
              path.startsWith("/opt") ||
              path.startsWith("/root") ||
              path === "." ||
              path === ".." ||
              path.includes("../"),
          )
        ) {
          return false;
        }

        // Only allow removing directories within user's working directory
        // Paths should be relative or within /home/user
        const safePaths = paths.every(
          (path) =>
            (!path.startsWith("/") || path.startsWith("/home/user")) &&
            !path.includes("../") &&
            path !== "." &&
            path !== "..",
        );

        if (!safePaths) {
          return false;
        }
      }

      // Don't allow removing system-like paths
      const systemPaths = args.some(
        (arg) =>
          arg.startsWith("/bin") ||
          arg.startsWith("/usr") ||
          arg.startsWith("/etc") ||
          arg === "/",
      );

      if (systemPaths) {
        return false;
      }
      break;
    case "chmod":
      // Only allow safe permission changes
      const permissions = args[0];
      if (
        permissions &&
        (permissions.includes("4") ||
          permissions.includes("777") ||
          permissions.includes("+s"))
      ) {
        return false;
      }
      break;

    case "tar":
      // Only allow safe tar operations (no extraction of absolute paths)
      if (
        args.some(
          (arg) =>
            arg.includes("x") && !args.includes("--no-absolute-filenames"),
        )
      ) {
        return false;
      }
      break;

    case "git":
      // Only allow safe git operations
      const gitCmd = args[0];
      const dangerousGitCmds = ["clone", "push", "pull", "fetch", "remote"];
      if (gitCmd && dangerousGitCmds.includes(gitCmd)) {
        return false;
      }
      break;

    case "find":
      // Prevent find from executing commands
      if (args.some((arg) => arg === "-exec" || arg === "-execdir")) {
        return false;
      }
      break;

    case "grep":
    case "egrep":
    case "fgrep":
      // Prevent recursive grep on large directories that could cause DoS
      if (args.some((arg) => arg === "-r" || arg === "-R")) {
        const paths = args.filter((arg) => !arg.startsWith("-"));
        if (
          paths.some(
            (path) => path === "/" || path === "/usr" || path === "/var",
          )
        ) {
          return false;
        }
      }
      break;
  }

  return true;
}

export function sanitizeCommand(command: string): string | null {
  const cmd = command.toLowerCase().trim();

  const dangerous = ["sudo"];
  // Check for dangerous commands and patterns
  for (const danger of dangerous) {
    if (cmd.includes(danger.toLowerCase())) {
      return null;
    }
  }

  // Block suspicious patterns
  const suspiciousPatterns = [
    /\$\(/, // Command substitution
    /`.*`/, // Backticks command substitution
    /\|\s*python/, // Piping to python
    /\|\s*perl/, // Piping to perl
    /\|\s*ruby/, // Piping to ruby
    /\|\s*node/, // Piping to node
    /;\s*rm/, // Chained rm commands
    /&&\s*rm/, // Conditional rm commands
    /\|\|\s*rm/, // Alternative rm commands
    /\*{3,}/, // Multiple wildcards
    /{.*,.*}/, // Brace expansion
    /\$\{.*\}/, // Parameter expansion
    /eval\s/, // Eval command
    /exec\s/, // Exec command
    /source\s/, // Source command
    /^\.\s+/, // Source command (dot with space at start)
    />.*dev\/(random|urandom|mem|kmem|port)/, // Block dangerous devices only
    /<.*dev\/(random|urandom|mem|kmem|port)/, // Block dangerous devices only
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(command)) {
      return null;
    }
  }

  // Expanded allowed commands with categories
  const allowedCommands = [
    // File and directory operations (safe subset)
    "ls",
    "echo",
    "ll",
    "la",
    "pwd",
    "cd",
    "mkdir",
    "rmdir",
    "touch",
    "cp",
    "mv",
    "rm",
    "ln",
    "readlink",
    // File viewing and editing (read-only mostly)
    "cat",
    "less",
    "more",
    "head",
    "tail",
    "file",
    "stat",
    "wc",
    "od",
    "strings",
    "hexdump",
    // Text processing
    "grep",
    "egrep",
    "fgrep",
    "rg",
    "sed",
    "awk",
    "cut",
    "tr",
    "paste",
    "sort",
    "uniq",
    "comm",
    "join",
    "fold",
    "fmt",
    "pr",
    "expand",
    "unexpand",
    "tac",
    "rev",
    "shuf",
    // Search and find
    "find",
    "locate",
    "which",
    "whereis",
    "type",
    "apropos",
    "whatis",
    // System information (safe subset)
    "date",
    "cal",
    "uptime",
    "whoami",
    "id",
    "uname",
    "hostname",
    "arch",
    "free",
    "df",
    "du",
    "lscpu",
    "ps",
    "pstree",
    "jobs",
    "top",
    "htop",
    "who",
    "w",
    "last",
    "lastlog",
    "env",
    "printenv",
    "set",
    // File permissions (safe subset)
    "chmod",
    "umask",
    // Archives (read-only operations)
    "tar",
    "gzip",
    "gunzip",
    "zip",
    // Text editors (if available in container)
    "nano",
    "vim",
    "vi",
    "emacs",
    // Development tools (safe subset)
    "diff",
    "cmp",
    "patch",
    "git",
    // History and help
    "history",
    "help",
    "man",
    "info",
    // Misc utilities
    "yes",
    "seq",
    "shuf",
    "factor",
    "bc",
    "dc",
    "expr",
    "sleep",
    "timeout",
    "true",
    "false",
    "test",
    "tree",
  ];

  const firstWord = command.trim().split(/\s+/)[0];
  if (!allowedCommands.includes(firstWord) && !firstWord.startsWith("./")) {
    return null;
  }

  // Additional validation for specific commands
  if (!validateSpecificCommand(firstWord, command)) {
    return null;
  }

  return command;
}

export function resolvePath(currentPath: string, relativePath: string): string {
  if (relativePath === "/") return "/home/user";
  if (relativePath.startsWith("/")) return relativePath;
  if (relativePath === "..") {
    const parts = currentPath.split("/").filter((p) => p);
    parts.pop();
    return "/" + parts.join("/") || "/";
  }
  if (relativePath === ".") return currentPath;

  // Handle relative paths
  const parts = currentPath.split("/").filter((p) => p);
  const relativeParts = relativePath.split("/").filter((p) => p);

  relativeParts.forEach((part) => {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  });

  return "/" + parts.join("/") || "/";
}
