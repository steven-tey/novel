import "@/styles/globals.css";
import cx from "classnames";
import { cal, inter } from "@/styles/fonts";
import Providers from "./providers";
import { Metadata } from "next";

const title =
  "Novel – Notion-style WYSYWIG editor with AI-powered autocompletions";
const description =
  "Novel is a Notion-style WYSYWIG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={cx(cal.variable, inter.variable)}>{children}</body>
      </Providers>
    </html>
  );
}
