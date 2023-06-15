"use client";

import { useCompletion } from "ai/react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "sonner";
import PreviewText from "./preview-text";

export default function Preview() {
  const { complete, isLoading } = useCompletion({
    id: "preview",
    api: "/api/generate",
    onResponse: (res) => {
      // trigger something when the response starts streaming in
      // e.g. if the user is rate limited, you can show a toast
      if (res.status === 429) {
        toast.error("You are being rate limited. Please try again later.");
      }
    },
    onFinish: () => {
      // do something with the completion result
      toast.success("Successfully generated completion!");
    },
  });

  const handleInputChange = useDebouncedCallback((e) => {
    complete(e.target.value);
  }, 500);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col space-y-5 py-24">
      <p>Current state: {isLoading ? "Generating..." : "Idle"}</p>
      <textarea
        className="w-full max-w-md rounded border border-gray-300 p-2 shadow-xl"
        placeholder="Enter your prompt..."
        onChange={handleInputChange}
      />
      <PreviewText />
    </div>
  );
}
