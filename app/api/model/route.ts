import { Together } from "together-ai";
import { Client } from "@neondatabase/serverless";

const apiKey = process.env.TOGETHER_API_KEY;
if (!apiKey) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  let client: Client | null = null;

  try {
    const { message, chatHistory, model } = await req.json();
    console.log("Model is :", model)

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

    const getTotalPages = async (semester: string, pdfName: string) => {
      if (!client) throw new Error("Database client not initialized");

      const query = `
        SELECT MAX(page_num) as total_pages
        FROM pdf_embeddings 
        WHERE semester = $1 AND pdf_name = $2
      `;

      const { rows } = await client.query(query, [semester, pdfName]);
      return rows[0]?.total_pages || 0;
    }

    const results = await getContext(embedding, semester);

    const totalPages = results.length > 0
      ? await getTotalPages(results[0].semester, results[0].pdf_name)
      : 0;
    const context = results.map((r) => r.content).join("\n");

    const formattedReferences = results
      .map(
        (r) =>
          `📘 [${r.pdf_name} - Page ${r.page_num} - ${r.semester}]\n${r.content}`,
      )
      .join("\n\n");

    const prompt = `
Rules:
- Consice replies and stright to point.
- Break down commands and give examples.
- Use chat history and references as source of truth.

REFERENCES:
${formattedReferences}
`.trim();

    const response = await together.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `${prompt}\n\nCHAT_HISTORY:\n${chatHistory}\n\nCONTEXT:\n${context}`
        },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: false,
    });

    const answer = response?.choices[0]?.message?.content ?? null;
    console.log("answer is : ", answer)

    const pdfData = {
      page: results[0].page_num,
      chapter: results[0].pdf_name,
      semester: results[0].semester,
      totalPages
    };

    console.log("pdfData: ", pdfData);

    const cleanedAnswer = answer
      ?.replace(/<think>[\s\S]*?(<\/think>|$)/g, "")
      .trim();


    console.log("cleanedAnswer: ", cleanedAnswer)

    return new Response(
      JSON.stringify({
        answer: model === "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free"
          ? cleanedAnswer
          : answer,
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
