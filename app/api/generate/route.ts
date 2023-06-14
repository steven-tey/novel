import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  let { content } = await req.json();

  // remove line breaks,
  // remove trailing slash
  // limit to 500 characters
  content = content.replace(/\n/g, " ").replace(/\/$/, "").slice(0, 500);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI writing assistant that autocompletes existing text based on context from prior text. " +
          "Give more weight/priority to the later characters than the beginning ones.",
      },
      {
        role: "user",
        content,
      },
    ],
    max_tokens: 50,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
