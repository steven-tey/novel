<a href="https://novel.sh">
  <img alt="Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions." src="/app/opengraph-image.png">
  <h1 align="center">Novel</h1>
</a>

<p align="center">
  An open-source Notion-style WYSIWYG editor with AI-powered autocompletions. 
</p>

<p align="center">
  <a href="https://news.ycombinator.com/item?id=36360789"><img src="https://img.shields.io/badge/Hacker%20News-369-%23FF6600" alt="Hacker News"></a>
  <a href="https://github.com/steven-tey/novel/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/steven-tey/novel?label=license&logo=github&color=f80&logoColor=fff" alt="License" />
  </a>
  <a href="https://github.com/steven-tey/novel"><img src="https://img.shields.io/github/stars/steven-tey/novel?style=social" alt="Novel.sh's GitHub repo"></a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#setting-up-locally"><strong>Setting Up Locally</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Introduction

[Novel](https://novel.sh/) is a Notion-style WYSIWYG editor with AI-powered autocompletions.

Here's a quick 30-second demo:

https://github.com/steven-tey/novel/assets/28986134/2099877f-4f2b-4b1c-8782-5d803d63be5c

<br />

## Deploy Your Own

You can deploy your own version of Novel to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://stey.me/novel-deploy)

## Setting Up Locally

To set up Novel locally, you'll need to clone the repository and set up the following environment variables:

- `OPENAI_API_KEY` – your OpenAI API key (you can get one [here](https://platform.openai.com/account/api-keys))
- `BLOB_READ_WRITE_TOKEN` – your Vercel Blob read/write token (currently [still in beta](https://vercel.com/docs/storage/vercel-blob/quickstart#quickstart), but feel free to [DM me on Twitter](https://twitter.com/steventey) for access)

If you've deployed this to Vercel, you can also use [`vc env pull`](https://vercel.com/docs/cli/env#exporting-development-environment-variables) to pull the environment variables from your Vercel project.

## Tech Stack

Novel is built on the following stack:

- [Next.js](https://nextjs.org/) – framework
- [Tiptap](https://tiptap.dev/) – text editor
- [OpenAI](https://openai.com/) - AI completions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) – AI library
- [Vercel](https://vercel.com) – deployments
- [TailwindCSS](https://tailwindcss.com/) – styles
- [Cal Sans](https://github.com/calcom/font) – font

## Contributing

Here's how you can contribute:

- [Open an issue](https://github.com/steven-tey/novel/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/steven-tey/novel/pull) to add new features/make quality-of-life improvements/fix bugs.

## Author

- Steven Tey ([@steventey](https://twitter.com/steventey))

## License

Licensed under the [MIT license](https://github.com/steven-tey/novel/blob/main/LICENSE.md).
