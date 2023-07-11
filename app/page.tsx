import Editor from "@/ui/editor";
import { Toolbar } from "@/components/toolbar";

export default function Page() {
  return (
    <div className="relative min-h-screen max-w-5xl mx-auto py-16">
      <Toolbar/>
      <Editor/>
    </div>
  );
}
