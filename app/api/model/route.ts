import Together from "together-ai";

const together = new Together();

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { message } = await req.json();

  const runner = together.chat.completions.stream({
    model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
    messages: [{ role: "user", content: message }],
    temperature: 0.7,
    max_tokens: 200,
  });

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";

// // Handle POST requests
//
//
// const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
//
// export async function POST(request: Request) {
//   const data = await request.json();
//   const response = await together.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: "you are a helpfull assistent",
//       },
//       {
//         role: "user",
//         content: data.message,
//       },
//     ],
//
//     model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
//     temperature: 0.7,
//     top_p: 0.7,
//     top_k: 50,
//     repetition_penalty: 1,
//     stop: ["<|eot_id|>", "<|eom_id|>"],
//     stream: true,
//   });
//
//   console.log(response);
//
//   return NextResponse.json({
//     answer: data.message,
//     // answer: response?.choices[0]?.message?.content || "No response from the AI",
//   });
// }
