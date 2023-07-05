import Editor from "@/ui/editor";
import Github from "@/ui/icons/github";
import Menu from "./menu";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
      <a
        href="/github"
        target="_blank"
        className="absolute bottom-5 left-5 z-10 max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 dark:hover:bg-stone-800 sm:bottom-auto sm:top-5"
      >
        <Github className="dark:text-white" />
      </a>
      <Menu />
      <Editor />
    </div>
  );
}
