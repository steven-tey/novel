import type { Metadata } from "next";
import Editor from "@/ui/editor";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center sm:justify-center">
      <Editor />
    </div>
  );
}
