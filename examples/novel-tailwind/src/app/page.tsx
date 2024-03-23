import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col">
        <ThemeToggle />
        <h1 className="text-4xl font-semibold"> Novel Example</h1>
      </div>
    </main>
  );
}
