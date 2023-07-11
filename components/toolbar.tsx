import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons"
import Link from "next/link";
import { FontToggle } from "@/components/font-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export function Toolbar() {
  return (
    <>
      <div className="flex justify-between pb-4 gap-2 px-4 lg:px-0">
        <div className="flex items-center gap-2">
          <Link
            href="/github"
            target="_blank"
          >
            <Button
              variant="outline"
            >
              Check
              <Icons.gitHub className="h-4 w-4 ml-2"/>
            </Button>
          </Link>
          <Link
            href="/deploy"
            target="_blank"
          >
            <Button
              variant="outline"
            >
              Deploy
              <Icons.vercel className="h-4 w-4 ml-2"/>
            </Button>
          </Link>
        </div>
        <div className="flex xl:hidden items-center gap-2">
          <FontToggle/>
          <ThemeToggle/>
        </div>
      </div>
      <div className="hidden sticky float-right w-min top-8 right-0 translate-x-12 xl:flex flex-col items-center gap-2">
        <FontToggle/>
        <ThemeToggle/>
      </div>
    </>
  )
}
