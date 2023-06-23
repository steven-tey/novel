import { useSyncExternalStore } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";
import { randomRoomName } from "./randomRoomName";

const partykitHost = "yjs.threepointone.partykit.dev/party";
let yProvider = createCollaborationProvider("offline-room", partykitHost);

export function useCollaborationProvider() {
  return useSyncExternalStore<YPartyKitProvider>(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
}

const listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => listeners.splice(listeners.indexOf(listener), 1);
}

function getSnapshot() {
  return yProvider;
}

function createCollaborationProvider(roomName: string, host: string) {
  const yDoc = new Y.Doc();
  const indexeddbPersistence = new IndexeddbPersistence(roomName, yDoc);
  const yProvider = new YPartyKitProvider(host, roomName, yDoc, {
    connect: false,
  });

  if (typeof window !== "undefined") {
    Object.assign(window, { yProvider });

    indexeddbPersistence.on("synced", (persistence: IndexeddbPersistence) => {
      console.log("indexeddb synced", persistence.synced);
    });
  }

  return yProvider;
}

export function connectToNewRoom() {
  const roomName = randomRoomName();
  joinRoom(roomName);
  return roomName;
}

export function joinRoom(roomName: string) {
  yProvider.destroy();
  yProvider = createCollaborationProvider(roomName, partykitHost);
  yProvider.connect();
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (yProvider.wsconnected) yProvider.destroy();
  });
}
