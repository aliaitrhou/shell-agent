import Together from "together-ai";

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { message } = await req.json();

  const together = new Together();

  const prompt = process.env.MAGIC_PROMPT || "";

  const runner = together.chat.completions.stream({
    model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";
