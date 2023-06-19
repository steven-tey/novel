import Editor from "@/ui/editor";
import Github from "@/ui/shared/github";

export default function Page() {
  return (
    <>
      <a
        href="/deploy"
        target="_blank"
        className="absolute bottom-5 left-5 max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto sm:top-5"
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
      <a
        href="/github"
        target="_blank"
        className="absolute bottom-5 right-5 max-h-fit rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto sm:top-5"
      >
        <Github />
      </a>
      <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
        <Editor />
      </div>
    </>
  );
}
