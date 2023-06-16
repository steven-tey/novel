import Editor from "@/ui/editor";
import Github from "@/ui/shared/github";

export default function Page() {
  return (
    <>
      <a
        href="/github"
        target="_blank"
        className="absolute bottom-5 right-5 max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:top-5"
      >
        <Github />
      </a>
      <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
        <Editor />
      </div>
    </>
  );
}
