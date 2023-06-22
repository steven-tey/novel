"use client";

import { Toaster, toast } from "sonner";
import {
  connectToNewRoom,
  joinRoom,
  useConnectionStatus,
  useUser,
} from "../extensions/collaboration";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsers } from "../extensions/collaboration/useUsers";
import { useEffect } from "react";
import { yProvider } from "../extensions/collaboration/yProvider";

export const CollaborationHeaderElements = () => {
  const connectionStatus = useConnectionStatus();
  const users = useUsers();
  const searchParams = useSearchParams();

  console.log({ connectionStatus, users });

  const roomInSearchParams = searchParams.get("room");
  useEffect(() => {
    if (
      connectionStatus !== "connecting" &&
      roomInSearchParams &&
      yProvider.roomname !== roomInSearchParams
    ) {
      console.log("Joining room from search params", roomInSearchParams);
      joinRoom(roomInSearchParams);
    }
  }, [roomInSearchParams, connectionStatus]);

  if (connectionStatus === "disconnected") {
    return <ShareButton />;
  }

  return (
    <>
      <div
        className={
          "before:content-[' '] flex items-center gap-1.5 before:block before:h-2 before:w-2 before:rounded-full before:bg-stone-300 data-[status='connected']:before:bg-emerald-500"
        }
        data-status={connectionStatus}
      >
        {connectionStatus === "connected"
          ? `${users.size} user${users.size === 1 ? "" : "s"} online`
          : "offline"}{" "}
        in room {yProvider.roomname}
      </div>
      <Toaster />
      <UserNameButton />
      <ShareButton />
    </>
  );
};

function UserNameButton() {
  const user = useUser();

  return (
    <button
      className="ml-auto rounded-lg border border-stone-100 px-2 py-1 transition-colors hover:border-stone-400"
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
      className="text-md rounded-lg border border-stone-200 px-2 py-1 font-semibold transition-colors hover:border-stone-400 sm:shadow-sm"
      onClick={() => {
        const url = new URL(window.location.href);
        console.log({ url: url.searchParams.get("room") });

        if (!url.searchParams.has("room")) {
          const roomName = connectToNewRoom();
          url.searchParams.set("room", roomName);
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
