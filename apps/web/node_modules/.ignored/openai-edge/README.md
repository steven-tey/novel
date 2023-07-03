# OpenAI Edge

A TypeScript module for querying OpenAI's API using `fetch` (a standard Web API)
instead of `axios`. This is a drop-in replacement for the official `openai`
module (which has `axios` as a dependency).

As well as reducing the bundle size, removing the dependency means we can query
OpenAI from edge environments. Edge functions such as Next.js Edge API Routes
are very fast and, unlike lambda functions, allow streaming data to the client.

The latest version of this module has feature parity with the official `v3.3.0`,
and also supports the chat completion `functions` parameter, which isn't yet
included in the official module.

## Installation

```shell
yarn add openai-edge
```

or

```shell
npm install openai-edge
```

## Responses

Every method returns a promise resolving to the standard `fetch` response i.e.
`Promise<Response>`. Since `fetch` doesn't have built-in support for types in
its response data, `openai-edge` includes an export `ResponseTypes` which you
can use to assert the correct type on the JSON response:

```typescript
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"

const configuration = new Configuration({
  apiKey: "YOUR-API-KEY",
})
const openai = new OpenAIApi(configuration)

const response = await openai.createImage({
  prompt: "A cute baby sea otter",
  size: "512x512",
  response_format: "url",
})

const data = (await response.json()) as ResponseTypes["createImage"]

const url = data.data?.[0]?.url

console.log({ url })
```

## Without global fetch

This module has zero dependencies and it expects `fetch` to be in the global
namespace (as it is in web, edge and modern Node environments). If you're
running in an environment without a global `fetch` defined e.g. an older version
of Node.js, please pass `fetch` when creating your instance:

```typescript
import fetch from "node-fetch"

const openai = new OpenAIApi(configuration, undefined, fetch)
```

## Available methods

- `cancelFineTune`
- `createAnswer`
- `createChatCompletion` (including support for `functions`)
- `createClassification`
- `createCompletion`
- `createEdit`
- `createEmbedding`
- `createFile`
- `createFineTune`
- `createImage`
- `createImageEdit`
- `createImageVariation`
- `createModeration`
- `createSearch`
- `createTranscription`
- `createTranslation`
- `deleteFile`
- `deleteModel`
- `downloadFile`
- `listEngines`
- `listFiles`
- `listFineTuneEvents`
- `listFineTunes`
- `listModels`
- `retrieveEngine`
- `retrieveFile`
- `retrieveFineTune`
- `retrieveModel`

## Without global FormData

This module also expects to be in an environment where `FormData` is defined. If you're running in Node.js, that means using v18 or later.

## Edge route handler examples

Here are some sample
[Next.js Edge API Routes](https://nextjs.org/docs/api-routes/edge-api-routes)
using `openai-edge`.

### 1. Streaming chat with `gpt-3.5-turbo`

Note that when using the `stream: true` option, OpenAI responds with
[server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).
Here's an example
[react hook to consume SSEs](https://github.com/dan-kwiat/react-hooks#useserversentevents)
and here's a [full NextJS example](https://github.com/dan-kwiat/chat-gpt-clone).

```typescript
import type { NextRequest } from "next/server"
import { Configuration, OpenAIApi } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        {
          role: "assistant",
          content: "The Los Angeles Dodgers won the World Series in 2020.",
        },
        { role: "user", content: "Where was it played?" },
      ],
      max_tokens: 7,
      temperature: 0,
      stream: true,
    })

    return new Response(completion.body, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "text/event-stream;charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    })
  } catch (error: any) {
    console.error(error)

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}

export default handler
```

### 2. Text completion with Davinci

```typescript
import type { NextRequest } from "next/server"
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: searchParams.get("prompt") ?? "Say this is a test",
      max_tokens: 7,
      temperature: 0,
      stream: false,
    })

    const data = (await completion.json()) as ResponseTypes["createCompletion"]

    return new Response(JSON.stringify(data.choices), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    })
  } catch (error: any) {
    console.error(error)

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}

export default handler
```

### 3. Creating an Image with DALL·E

```typescript
import type { NextRequest } from "next/server"
import { Configuration, OpenAIApi, ResponseTypes } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const handler = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  try {
    const image = await openai.createImage({
      prompt: searchParams.get("prompt") ?? "A cute baby sea otter",
      n: 1,
      size: "512x512",
      response_format: "url",
    })

    const data = (await image.json()) as ResponseTypes["createImage"]

    const url = data.data?.[0]?.url

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    })
  } catch (error: any) {
    console.error(error)

    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}

export default handler
```
