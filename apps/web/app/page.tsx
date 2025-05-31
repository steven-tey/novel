"use client";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";
import { DocumentTitle } from "@/components/tailwind/advanced-editor";
import { useUser } from "@/app/providers";
import { useLatestDocument } from "@/hooks/use-latest-document";

export default function Page() {
  const user = useUser();
  const {
    docId,
    setDocId,
    saveStatus,
    setSaveStatus,
    title,
    setTitle,
    loading,
    content,
    setContent,
  } = useLatestDocument(user);

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 py-1 sm:px-5">
      <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 justify-between">
        <img src="/images/logo-light-mode.png" alt="Logo" className="h-32 w-auto mr-2" />
        <Menu />
      </div>
      <div className="w-full max-w-screen-lg">
        <DocumentTitle
          user={user}
          docId={docId}
          setDocId={setDocId}
          saveStatus={saveStatus}
          setSaveStatus={setSaveStatus}
          title={title}
          setTitle={setTitle}
          loading={loading}
        />
      </div>
      <TailwindAdvancedEditor
        docId={docId}
        setDocId={setDocId}
        saveStatus={saveStatus}
        setSaveStatus={setSaveStatus}
        content={content}
        setContent={setContent}
        loading={loading}
      />
    </div>
  );
}
