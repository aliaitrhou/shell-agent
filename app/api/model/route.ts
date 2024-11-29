import Together from "together-ai";
import { createClient } from "@supabase/supabase-js";

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");
const sbApiKey = process.env.SUPABASE_API_KEY || "";
const sbURL = process.env.SUPABASE_URL || "";

export async function POST(req: Request) {
  const { message, chatHistory } = await req.json();
  const together = new Together();

  // Get the query embedding for the message using together ai embedding model
  const response = await together.embeddings.create({
    model: "togethercomputer/m2-bert-80M-8k-retrieval",
    input: message,
  });

  const supabase = createClient(sbURL, sbApiKey);

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: response.data[0].embedding,
    match_count: 2,
  });

  if (error) {
    console.log(error);
  }

  const prompt = process.env.MAGIC_PROMPT || "";
  const runner = together.chat.completions.stream({
    model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content:
          prompt +
          `CHAT_HISTORY:${JSON.stringify(chatHistory)}\nCONTEXT: ${data.map((doc: any) => doc.content)}`,
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return new Response(runner.toReadableStream());
}
export const runtime = "nodejs";
