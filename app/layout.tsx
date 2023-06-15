import "@/styles/globals.css";
import cx from "classnames";
import { cal, inter } from "@/styles/fonts";
import Providers from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novel – Notion-style WYSYWIG editor with AI-powered autocompletions",
  description:
    "Novel is a Notion-style WYSYWIG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.",
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
