import { Together } from "together-ai";
import { Client } from "@neondatabase/serverless";

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { message, chatHistory, model } = await req.json();
  const together = new Together({ apiKey });
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  const getEmbedding = async (text: string) => {
    const response = await together.embeddings.create({
      model: "togethercomputer/m2-bert-80M-8k-retrieval",
      input: text,
    });

    const q_embeddings = response["data"][0]["embedding"];

    const q_embeddings_str = q_embeddings.toString().replace(/\.\.\./g, "");
    return q_embeddings_str;
  };

  const getContext = async (em: string) => {
    // Query the database using your actual column names
    const insertQuery = `
      SELECT content
      FROM pdf_embeddings
      ORDER BY embedding <=> '[${em}]'
      LIMIT 2; 
      `;
    console.log("Querying database...");
    const { rows } = await client.query(insertQuery);
    await client.end();

    const context = rows.reduce((acc, cur) => {
      return acc + cur.content;
    }, "");

    return context;
  };

  // const getContext = async (em: string) => {
  // Query the database for the context
  //     const insertQuery = `
  //       SELECT content
  // SELECT text, n_tokens, embeddings,
  //       FROM (
  //         (embeddings <=> '[${em}]') AS distances,
  //         SUM(n_tokens) OVER (ORDER BY (embeddings <=> '[${em}]')) AS cum_n_tokens
  //         FROM pdf_embeddings
  //         ) subquery
  //       WHERE cum_n_tokens <= $1
  //       ORDER BY distances ASC;
  //       `;

  //   const queryParams = [1700];
  //
  //   console.log("Querying database...");
  //   const { rows } = await client.query(insertQuery, queryParams);
  //   await client.end();
  //   const context = rows.reduce((acc, cur) => {
  //     return acc + cur.text;
  //   }, "");
  //
  //   return context;
  // };

  const embedding = await getEmbedding(message);
  await client.connect();
  const context = await getContext(embedding);
  console.log("Context is : ", context);

  const prompt = process.env.MAGIC_PROMPT || "";
  const runner = together.chat.completions.stream({
    model,
    messages: [
      {
        role: "system",
        content: prompt + `CHAT_HISTORY:${chatHistory}\nCONTEXT: `,
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return new Response(runner.toReadableStream());
}
export const runtime = "nodejs";
