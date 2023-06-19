import { Editor } from "@tiptap/react";
import { ConnectionStatus, useUser } from "../extensions/collaboration";

export const CollaborationFooter = ({ connectionStatus, editor }: {
  connectionStatus: ConnectionStatus;
  editor: Editor | null
}) => {
  const user = useUser();

  return (
    <footer className="bottom-8 flex flex-row items-center text-sm">
      <>
        <div
          className={
            "before:content-[' '] flex items-center gap-1.5 before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500"
          }
          data-status={connectionStatus}
        >
          {editor && connectionStatus === "connected"
            ? `${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1
                  ? ""
                  : "s"
              } online`
            : "offline"}
        </div>
      </>
      <button
        className="ml-auto rounded-lg border border-stone-100 px-2 py-1 transition-colors hover:border-stone-400"
        onClick={user.setName}
        style={{
          opacity: user.name ? 1 : 0,
        }}
      >
        {user.name || "&nbsp;"}
      </button>
    </footer>
  )
}
