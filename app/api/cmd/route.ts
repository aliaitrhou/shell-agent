import { NextRequest } from "next/server";
import Together from "together-ai";

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: NextRequest) {
  const { command } = await req.json();

  const together = new Together();

  const runner = together.chat.completions.stream({
    model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an OS simulator. You will only respond with the output of terminal commands. Do not answer questions directly or engage in conversations. Only return the command's stdout or indicate if the command is invalid. Example: If asked 'Do you speak Arabic?' reply with an error or prompt as if it's a terminal command like this (bash: do: command not found).",
      },
      { role: "user", content: `[COMMAND]: ${command}` },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  //TODO: don't stream this response
  return new Response(runner.toReadableStream());
}

export const runtime = "nodejs";
