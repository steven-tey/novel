import Editor from "@/ui/editor";
import { ThemeSwitcher } from "@/ui/editor/components/theme-switcher";
import Github from "@/ui/shared/github";
import { cookies } from "next/headers";

export default function Page() {

  const theme = cookies().get("theme")?.value === "dark" ? "dark" : "light"

  return (
    <>
      <a
        href="/deploy"
        target="_blank"
        className="absolute p-2 transition-colors duration-200 rounded-lg bottom-5 left-5 max-h-fit hover:bg-stone-100 sm:bottom-auto sm:top-5 dark:hover:bg-dark-primary"
      >
        <svg
          width={22}
          viewBox="0 0 76 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="dark:text-white"
        >
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor" />
        </svg>
      </a>
      <a
        href="/github"
        target="_blank"
        className="absolute p-2 transition-colors duration-200 rounded-lg bottom-5 right-5 max-h-fit hover:bg-stone-100 sm:bottom-auto sm:top-5 dark:hover:bg-dark-primary"
      >
        <Github className="dark:text-white" />
      </a>
      <div
        className="absolute p-2 transition-colors duration-200 rounded-lg bottom-5 right-16 max-h-fit hover:bg-stone-100 sm:bottom-auto sm:top-5 dark:hover:bg-dark-primary"
      >
        <ThemeSwitcher theme={theme} />

      </div>
      <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)] dark:bg-stone-900">
        <Editor />
      </div>
    </>
  );
}
