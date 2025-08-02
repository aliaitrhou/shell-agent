type managerProps = {
  action: string;
  filename: string;
  content: string;
  cwd: string;
  sessionId: string;
};
export const scriptsManager = async ({
  action,
  filename,
  content,
  cwd,
  sessionId,
}: managerProps) => {
  const res = await fetch(`/api/scripts?session_id=${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action,
      filename,
      content,
      cwd,
    }),
  });

  if (!res.ok) {
    throw new Error("There was an error");
  }

  const result = await res.json();

  console.log("result: ", result);
};
