import { useCompletion } from "ai/react";

export default function PreviewText() {
  const { completion } = useCompletion({
    id: "preview",
    api: "/api/generate",
  });
  return <p>{completion}</p>;
}
