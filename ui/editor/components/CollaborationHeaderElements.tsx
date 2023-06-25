"use client";

import { toast } from "sonner";
import {
  connectToNewRoom,
  joinRoom,
  useCollaborationProvider,
  useConnectionStatus,
  useUser,
} from "../extensions/collaboration";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsers } from "../extensions/collaboration/useUsers";
import { useEffect } from "react";

export const CollaborationHeaderElements = () => {
  const connectionStatus = useConnectionStatus();
  const users = useUsers();
  const searchParams = useSearchParams();
  const collaborationStore = useCollaborationProvider();

  const roomInSearchParams = searchParams.get("room");
  useEffect(() => {
    if (
      connectionStatus !== "connecting" &&
      roomInSearchParams &&
      collaborationStore.roomname !== roomInSearchParams
    ) {
      joinRoom(roomInSearchParams);
    }
  }, [roomInSearchParams, connectionStatus, collaborationStore]);

  if (connectionStatus === "disconnected") {
    return (
      <>
        <ShareButton />
      </>
    );
  }

  return (
    <>
      <div
        className={
          "before:content-[' '] flex items-center gap-1.5 text-xs before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500 sm:text-base"
        }
        data-status={connectionStatus}
      >
        <span className="overflow-ellipsis whitespace-nowrap">
          {connectionStatus === "connected"
            ? `${users.size} user${users.size === 1 ? "" : "s"} online`
            : "offline"}{" "}
          <span className="hidden md:inline">
            in room {collaborationStore.roomname}
          </span>
        </span>
      </div>
      <UserNameButton />
      <ShareButton />
    </>
  );
};

function UserNameButton() {
  const user = useUser();

  return (
    <button
      className="ml-auto rounded-lg border border-stone-200 px-2 py-1 transition-colors hover:border-stone-400 sm:shadow-sm"
      onClick={user.setName}
      style={{
        opacity: user.name ? 1 : 0,
      }}
    >
      {user.name || "&nbsp;"}
    </button>
  );
}

function ShareButton() {
  const router = useRouter();

  return (
    <button
      className="flex-shrink-0 rounded-lg border border-stone-200 px-2 py-1 transition-colors hover:border-stone-400 sm:shadow-sm"
      onClick={() => {
        const url = new URL(window.location.href);

        if (!url.searchParams.has("room")) {
          const roomName = connectToNewRoom();
          url.searchParams.set("room", roomName.trim());
          void router.push(url.toString());
        }

        navigator.clipboard.writeText(url.toString());
        toast.success("URL copied to clipboard.");
      }}
    >
      Share 🔗
    </button>
  );
}
