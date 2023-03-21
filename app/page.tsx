import type { Metadata } from "next";
import dynamic from "next/dynamic";
const BlockNoteEditor = dynamic(() => import("./blocknote-editor"), {
  ssr: false,
});
import Editor from "./editor";

export const metadata: Metadata = {
  title: "Novel",
  description: "Novel demo",
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Editor />
    </div>
  );
}
