import { useMemo, useSyncExternalStore } from "react";
import { useCollaborationProvider } from "./collaborationStore";

export function usePersistenceSynced() {
  const yProvider = useCollaborationProvider();

  const { subscribe, getSnapshot } = useMemo(() => {
    if (!yProvider.persistence) {
      return {
        subscribe: () => () => {},
        getSnapshot: () => false,
      };
    }

    return {
      subscribe(listener: () => void) {
        if (!yProvider.persistence.synced) {
          yProvider.persistence.whenSynced.then(listener);
        }
        return () => {};
      },
      getSnapshot() {
        return yProvider.persistence?.synced;
      },
    };
  }, [yProvider]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
