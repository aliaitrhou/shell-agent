import { NextResponse } from "next/server";
import Together from "together-ai";

// Handle GET requests
export async function GET() {
  return NextResponse.json({ message: "Hello, world!" });
}

// Handle POST requests

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

export async function POST(request: Request) {
  const data = await request.json();
  const response = await together.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "you are a helpfull assistent",
      },
      {
        role: "user",
        content: data.message,
      },
    ],

    model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
    temperature: 0.7,
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1,
    stop: ["<|eot_id|>", "<|eom_id|>"],
    stream: true,
  });

  return NextResponse.json({
    answer: response?.choices[0]?.message?.content || "No response from the AI",
  });
}
