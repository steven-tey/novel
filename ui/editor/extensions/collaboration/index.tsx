import TiptapCollaboration from "@tiptap/extension-collaboration";
import TiptapCursor from "@tiptap/extension-collaboration-cursor";
import { useCallback, useEffect, useState } from "react";
import * as Y from "yjs";

import { randomRoomName } from "./randomRoomName";
import { yProvider } from "./yProvider";

export function connectToNewRoom() {
  const roomName = randomRoomName();
  joinRoom(roomName);
  return roomName;
}

export function joinRoom(roomName: string) {
  yProvider.destroy();
  yProvider.doc = new Y.Doc();
  yProvider.roomname = roomName;
  yProvider.connect();
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (yProvider.wsconnected) yProvider.disconnect();
  });
}

export const collaborationExtensions = [
  TiptapCollaboration.configure({ document: yProvider.doc, field: "content" }),
  TiptapCursor.configure({ provider: yProvider }),
];

export type ConnectionStatus = "disconnected" | "connecting" | "connected";
export function useConnectionStatus() {
  const [state, setState] = useState<ConnectionStatus>("disconnected");
  yProvider.on("status", (event: { status: ConnectionStatus }) => {
    setState(event.status);
  });
  return state;
}

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

export function useUser() {
  const [currentUser, setCurrentUser] = useState({ name: "" });

  const setName = useCallback(() => {
    const name = (window.prompt("Name") || "").trim().slice(0, 32);

    if (name) {
      yProvider.awareness.setLocalStateField("user", {
        name,
        color: getRandomColor(),
      });
      localStorage.setItem("name", name);
      return setCurrentUser({ name });
    }
  }, []);

  useEffect(() => {
    const localState = yProvider.awareness.getLocalState();
    if (!localState?.user?.name) {
      const stored = localStorage.getItem("name");
      if (stored) {
        const user = { name: stored, color: getRandomColor() };
        yProvider.awareness.setLocalStateField("user", user);
        yProvider.once("sync", () => {
          yProvider.awareness.setLocalStateField("user", user);
        });
      }
      const name = stored || `User ${yProvider.awareness.clientID}`;
      setCurrentUser({ name });
    }
  }, []);

  return {
    setName,
    name: currentUser.name,
  };
}
