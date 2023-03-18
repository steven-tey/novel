import useLocalStorage from "@/lib/hooks/use-local-storage";
import ReactMarkdown from "react-markdown";

export default function Preview() {
  const [markdown] = useLocalStorage<string>("content", "");

  return (
    <article className="max-w-screen-lg w-full border-2 border-gray-600 rounded-lg min-h-[500px] mt-10 p-10 prose-xl">
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
