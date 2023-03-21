import useLocalStorage from "@/lib/hooks/use-local-storage";
import ReactMarkdown from "react-markdown";

export default function Preview() {
  const [markdown] = useLocalStorage<string>("content", "");

  return (
    <article className="prose-xl mt-10 min-h-[500px] w-full max-w-screen-lg rounded-lg border-2 border-gray-600 p-10">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              {...props}
              className="font-medium text-gray-800 underline transition-colors"
            />
          ),
          code: ({ node, ...props }) => (
            <code
              {...props}
              // @ts-ignore (to fix "Received `true` for a non-boolean attribute `inline`." warning)
              inline="true"
              className="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800"
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
