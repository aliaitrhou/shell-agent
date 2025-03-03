import { NextRequest } from "next/server";
import { Together } from "together-ai";

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) throw new Error("Missing Together env var");

let cwd = "~";

export async function POST(req: NextRequest) {
  const { command, commandsHistory } = await req.json();

  const together = new Together({
    apiKey,
  });

  console.log("commands history is:", commandsHistory);

  const commandsString = commandsHistory
    .map((data: string, idx: number) => {
      if (idx % 2 === 0) {
        return `| command ${idx + 1}: ${data}`;
      } else {
        return `output:  ${data} |`;
      }
    })
    .join(" ");

  console.log("the commmand passed to the model are: ", commandsString);

  const systemPrompt = `
  ROLE: You are an OS simulator. Given [CURRENT_COMMAND], respond only with the raw output of the executed command, like a real terminal.\n
_______
  TASKS:
	1. Execute commands exactly as a shell would—no explanations, no autocorrections.\n
  2. If the user runs the cd command with a directory that already exists, call change_cwd(new_directory) to switch to that directory. If the directory does not exist, return: bash: cd: new_directory: No such file or directory.\n
	otherwise, return this -> bash: cd: new_directory: No such file or directory.\n
	3. For invalid commands, return: bash: xyz: command not found.\n
	4. For command errors, return the actual shell error message.\n
	5. No assumptions, no extra output—only strict terminal behavior.\n
  6. Most important all your outputs should be based on the previous commands and outputs if there are available.
_______
STARTING POINT:
  - ~: Contains README.txt.
  - readme file content : "Why do programmers prefer dark mode? Because light attracts bugs!"
_______
[PREVIOUS_COMMANDS_WITH_OUTPUT]: ${commandsString}, [CURRENT_CWD]: ${cwd}, [CURRENT_COMMAND]: ${command}
  `;

  const response = await together.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: systemPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
    // TODO: add more tools, like a set of commands to do so you can run a desire one.
    tools: [
      {
        type: "function",
        function: {
          name: "change_cwd",
          description: "Change the current working directory.",
          parameters: {
            type: "object",
            properties: {
              new_cwd: {
                type: "string",
                description:
                  "The new working directory after executing the cd command.",
              },
            },
            required: ["new_cwd"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  // Check if there's a tool call for directory change
  const toolCall = response.choices[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.name === "change_cwd") {
    const newCwd = JSON.parse(toolCall.function.arguments).new_cwd;
    cwd = newCwd; // Update cwd
    console.log(`CWD updated to: ${cwd}`);
  }

  console.log("Current working directory is : ", cwd);

  return new Response(
    JSON.stringify({
      cwd: cwd,
      content: response?.choices[0]?.message?.content || "",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

export const runtime = "nodejs";
