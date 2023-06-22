import YProvider from "y-partykit/provider";
import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

// const partykitHost = "localhost:1999"
const partykitHost = "yjs.threepointone.partykit.dev/party";

const yDoc = new Y.Doc();

const indexeddbPersistence = new IndexeddbPersistence("novel-content", yDoc);

export const yProvider = new YProvider(partykitHost, "no-room", yDoc, {
  connect: false,
});

if (typeof window !== "undefined") {
  Object.assign(window, { yProvider });
}

function onIndexedDBSync() {
  indexeddbPersistence.on("synced", (idbPersistence: IndexeddbPersistence) => {
    console.log("idbPersistence.synced", idbPersistence.synced);
  });
}
