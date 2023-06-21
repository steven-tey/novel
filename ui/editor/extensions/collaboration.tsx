import TiptapCollaboration from "@tiptap/extension-collaboration";
import TiptapCursor from "@tiptap/extension-collaboration-cursor";
import { useCallback, useEffect, useState } from "react";
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import { uniqueNamesGenerator, adjectives, starWars, animals } from 'unique-names-generator';

// const partykitHost = "localhost:1999"
const partykitHost = "yjs.threepointone.partykit.dev/party";

const yDoc = new Y.Doc();
const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get("room");
let yProvider: YProvider;
if (room) {
  yProvider = new YProvider(
    partykitHost,
    room,
    yDoc,
    { connect: false },
  );
} else {  
  const roomname = uniqueNamesGenerator({
    dictionaries: [adjectives, starWars, animals],
    separator: '-',
    length: 3,
    style: 'lowerCase'
  }).replace(/ /g, '');
  yProvider = new YProvider(
    partykitHost,
    roomname,
    yDoc,
    { connect: false },
  );
  window.location.search = `?room=${roomname}`;
}

export { yProvider } 

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (yProvider.wsconnected) yProvider.disconnect();
  });
}

export const collaborationExtensions = [
  TiptapCollaboration.configure({ document: yDoc, field: "content" }),
  TiptapCursor.configure({ provider: yProvider }),
];

export function useConnection() {
  useEffect(() => {
    yProvider.connect();
    return () => yProvider.disconnect();
  }, []);
}

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
