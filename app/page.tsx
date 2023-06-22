import Editor from "@/ui/editor";
import { CollaborationHeaderElements } from "@/ui/editor/components/CollaborationHeaderElements";
import Github from "@/ui/shared/github";

export default function Page() {
  return (
    <>
      <div className="absolute bottom-5 flex w-full justify-between px-5  sm:bottom-auto sm:top-5">
        <a
          href="/deploy"
          target="_blank"
          className="max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100"
        >
          <svg
            width={22}
            viewBox="0 0 76 76"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#000000" />
          </svg>
        </a>
        <div className="flex gap-x-2">
          <CollaborationHeaderElements />
          <a
            href="/github"
            target="_blank"
            className="max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100"
          >
            <Github />
          </a>
        </div>
      </div>
      <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(10vh)]">
        <Editor />
      </div>
    </>
  );
}
