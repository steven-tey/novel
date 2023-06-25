/* eslint-disable no-unused-vars */
declare module "y-indexeddb" {
  import * as Y from "yjs";
  import * as idb from "lib0/indexeddb";
  import * as promise from "lib0/promise";
  import { Observable } from "lib0/observable";

  export const PREFERRED_TRIM_SIZE: number;

  export const fetchUpdates: (
    idbPersistence: IndexeddbPersistence,
    beforeApplyUpdatesCallback?: (store: IDBObjectStore) => void,
    afterApplyUpdatesCallback?: (store: IDBObjectStore) => void,
  ) => Promise<IDBObjectStore>;

  export const storeState: (
    idbPersistence: IndexeddbPersistence,
    forceStore?: boolean,
  ) => Promise<void>;

  export const clearDocument: (name: string) => Promise<void>;

  export class IndexeddbPersistence extends Observable<"synced"> {
    constructor(public name: string, public doc: Y.Doc);
    synced: boolean;
    whenSynced: Promise<IndexeddbPersistence>;
    clearData(): Promise<void>;
    get(
      key: string | number | ArrayBuffer | Date,
    ): Promise<string | number | ArrayBuffer | Date | any>;
    set(
      key: string | number | ArrayBuffer | Date,
      value: string | number | ArrayBuffer | Date,
    ): Promise<string | number | ArrayBuffer | Date>;
    del(key: string | number | ArrayBuffer | Date): Promise<undefined>;

    on(event: "synced", listener: (idbPersistence: this) => void): void;
  }
}

declare module "lib0/observable" {
  export class Observable<N> {
    private _observers: Map<N, Set<Function>>;
    constructor();
    on(name: N, f: Function): void;
    once(name: N, f: Function): void;
    off(name: N, f: Function): void;
    emit(name: N, args: Array<any>): void;
    destroy(): void;
  }
}
