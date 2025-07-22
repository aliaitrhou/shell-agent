// Each chat should have it's running commands envirement so i well use
// chatId as the envirement/session id

export default async function commandRunner({
  command,
  chatId,
  currentWorkingDirectory,
}: {
  command: string;
  chatId: string;
  currentWorkingDirectory: string;
}) {
  const res = await fetch("/api/cmd", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      command,
      sessionId: chatId,
      cwd: currentWorkingDirectory,
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to fetch model response: ${res.status} ${res.statusText}`,
    );
  }

  if (!res.body) {
    throw new Error("Response body is undefined.");
  }

  const responseData = await res.json();

  console.log("Client side (response Data):", responseData);

  return {
    role: "ShellOutput",
    text: responseData.output as string,
    mode: "Command",
    newCwd: responseData.cwd as string,
  };
}
