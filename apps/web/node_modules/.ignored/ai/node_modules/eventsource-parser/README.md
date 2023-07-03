# eventsource-parser

[![npm version](https://img.shields.io/npm/v/eventsource-parser.svg?style=flat-square)](https://www.npmjs.com/package/eventsource-parser)[![npm bundle size](https://img.shields.io/bundlephobia/minzip/eventsource-parser?style=flat-square)](https://bundlephobia.com/result?p=eventsource-parser)

A streaming parser for [server-sent events/eventsource](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events), without any assumptions about how the actual stream of data is retrieved. It is intended to be a building block for clients and polyfills in javascript environments such as browsers, node.js and deno.

You create an instance of the parser, and _feed_ it chunks of data - partial or complete, and the parse emits parsed messages once it receives a complete message.

## Installation

```bash
npm install --save eventsource-parser
```

## Usage

```ts
import {createParser, ParsedEvent, ReconnectInterval} from 'eventsource-parser'

function onParse(event: ParsedEvent | ReconnectInterval) {
  if (event.type === 'event') {
    console.log('Received event!')
    console.log('id: %s', event.id || '<none>')
    console.log('name: %s', event.name || '<none>')
    console.log('data: %s', event.data)
  } else if (event.type === 'reconnect-interval') {
    console.log('We should set reconnect interval to %d milliseconds', event.value)
  }
}

const parser = createParser(onParse)
const sseStream = getSomeReadableStream()

for await (const chunk of sseStream) {
  parser.feed(chunk)
}

// If you want to re-use the parser for a new stream of events, make sure to reset it!
parser.reset()
console.log('Done!')
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
