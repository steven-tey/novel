import { Github } from "@/components/tailwind/ui/icons";
import { Button } from "@/components/tailwind/ui/button";
import Menu from "@/components/tailwind/ui/menu";
import TailwindEditor from "@/components/tailwind/editor";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center sm:px-5 sm:pt-[calc(20vh)]">
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-5 left-5 z-10 max-h-fit rounded-lg p-2 transition-colors duration-200 sm:bottom-auto sm:top-5"
      >
        <a href="https://github.com/steven-tey/novel" target="_blank">
          <Github />
        </a>
      </Button>
      <Menu />
      <TailwindEditor />
    </div>
  );
}
