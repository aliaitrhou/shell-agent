import { Together } from "together-ai";
import { Client } from "@neondatabase/serverless";

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  let client: Client | null = null;

  try {
    const { message, chatHistory, model } = await req.json();

    const { searchParams } = new URL(req.url);
    const semester = searchParams.get("semester");

    console.log("chat history : ", chatHistory);

    // NOTE: Remove this variable later and make it boolean
    // so the model an decied whether to switch or not.
    const together = new Together({ apiKey });
    client = new Client({ connectionString: process.env.DATABASE_URL });

    const getEmbedding = async (text: string) => {
      const response = await together.embeddings.create({
        model: "BAAI/bge-base-en-v1.5",
        input: text,
      });
      const q_embeddings = response["data"][0]["embedding"];
      const q_embeddings_str = q_embeddings.toString().replace(/\.\.\./g, "");
      return q_embeddings_str;
    };

    const getContext = async (em: string, semester: string | null) => {
      if (!client) throw new Error("Database client not initialized");

      const query = `
    SELECT *
    FROM pdf_embeddings
    WHERE semester = $1
    ORDER BY embedding <=> $2::vector
    LIMIT 1;
  `;

      const { rows } = await client.query(query, [semester, `[${em}]`]);

      return rows;
    };

    const embedding = await getEmbedding(message);

    await client.connect();

    const results = await getContext(embedding, semester);
    const context = results.map((r) => r.content).join("\n");

    const formattedReferences = results
      .map(
        (r) =>
          `📘 [${r.pdf_name} - Page ${r.page_num} - ${r.semester}]\n${r.content}`,
      )
      .join("\n\n");

    console.log("formattedReferences: ", formattedReferences);
    const prompt = `
Rules:
- Consice replies and stright to point.
- Break down commands and give examples.
- Use chat history and references as source of truth.

REFERENCES:
${formattedReferences}
`.trim();

    console.log("model is : ", model);
    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [
        {
          role: "system",
          content: prompt + `CHAT_HISTORY:${chatHistory}\nCONTEXT: ${context}`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
      stream: false,
    });

    const answer = response?.choices[0]?.message?.content ?? null;

    const pdfData = {
      page: results[0].page_num,
      chapter: results[0].pdf_name,
      semester: results[0].semester,
    };

    console.log("pdfData: ", pdfData);

    return new Response(
      JSON.stringify({
        answer,
        pdfData,
      }),
    );
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  } finally {
    // Ensure database connection is always closed
    if (client) {
      try {
        await client.end();
      } catch (error) {
        console.error("Error closing database connection:", error);
      }
    }
  }
}

export const runtime = "nodejs";
