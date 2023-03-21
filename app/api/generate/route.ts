import { OpenAIStream, OpenAIStreamPayload } from "@/lib/openai/stream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export async function POST(req: Request): Promise<Response> {
  let { content } = (await req.json()) as {
    content?: string;
  };

  if (!content) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // truncate content to the last 500 characters
  content = content.slice(-500);

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that autocompletes existing text based on context from prior text. Give more weight/priority to the later characters than the beginning ones, and add leading spaces accordingly.",
      },
      { role: "user", content },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 15,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}
