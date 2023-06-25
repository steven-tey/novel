import { useSyncExternalStore } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

import { randomRoomName } from "./randomRoomName";

const partykitHost = "yjs.threepointone.partykit.dev/party";
let yProvider = createCollaborationProvider("offline-room", partykitHost);

interface CollaborationProvider extends YPartyKitProvider {
  persistence?: IndexeddbPersistence;
}

export function useCollaborationProvider() {
  return useSyncExternalStore<CollaborationProvider>(
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
  const indexeddbPersistence =
    typeof window !== "undefined"
      ? new IndexeddbPersistence(roomName, yDoc)
      : undefined;
  const yProvider: CollaborationProvider = new YPartyKitProvider(
    host,
    roomName,
    yDoc,
    {
      connect: false,
    },
  );

  if (typeof window !== "undefined") {
    Object.assign(window, { yProvider });

    indexeddbPersistence.on("synced", (persistence: IndexeddbPersistence) => {
      if (persistence.synced) {
        console.log(
          `%c[Collaboration]%c IndexedDB synced.`,
          "color: rgb(120, 120, 120)",
          "color: inherit",
        );
      }
    });
  }

  yProvider.persistence = indexeddbPersistence;
  return yProvider;
}

export function connectToNewRoom() {
  const roomName = randomRoomName();

  console.log(
    `%c[Collaboration]%c Creating new room: ${roomName}`,
    "color: rgb(120, 120, 120)",
    "color: inherit",
  );

  const xmlFrag = yProvider.doc.getXmlFragment("offline-room");

  yProvider.destroy();
  yProvider = createCollaborationProvider(roomName, partykitHost);
  yProvider.connect();

  yProvider.doc
    .getXmlFragment(roomName)
    .insert(
      0,
      xmlFrag
        .toArray()
        .map((item) =>
          item instanceof Y.AbstractType ? item.clone() : item,
        ) as Y.XmlElement[],
    );

  return roomName;
}

export function joinRoom(roomName: string) {
  console.log(
    `%c[Collaboration]%c Joining room: ${roomName}`,
    "color: rgb(120, 120, 120)",
    "color: inherit",
  );
  yProvider.destroy();
  yProvider = createCollaborationProvider(roomName, partykitHost);
  yProvider.connect();
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    if (yProvider.wsconnected) yProvider.destroy();
  });
}
