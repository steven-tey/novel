import "@/styles/collaboration.css";
import "@/styles/globals.css";
import cx from "classnames";
import { cal, inter } from "@/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { Toaster } from "sonner";

const title =
  "Novel – Notion-style WYSIWYG editor with AI-powered autocompletions";
const description =
  "Novel is a Notion-style WYSIWYG editor with AI-powered autocompletions. Built with Tiptap, OpenAI, and Vercel AI SDK.";

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
    creator: "@steventey",
  },
  metadataBase: new URL("https://novel.sh"),
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Toaster />
      <body className={cx(cal.variable, inter.variable)}>{children}</body>
      <Analytics />
    </html>
  );
}
