import { Github } from "@/components/tailwind/ui/icons";
import { Button } from "@/components/tailwind/ui/button";
import Menu from "@/components/tailwind/ui/menu";
import TailwindEditor from "@/components/tailwind/editor";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(20vh)]">
        <Button size="icon" variant="outline">
          <a href="https://github.com/steven-tey/novel" target="_blank">
            <Github />
          </a>
        </Button>
        <Link href="/docs" className="ml-auto">
          <Button variant="ghost">Documentation</Button>
        </Link>
        <Menu />
      </div>
      <TailwindEditor />
    </div>
  );
}
