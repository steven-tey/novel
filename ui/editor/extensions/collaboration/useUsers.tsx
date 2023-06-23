import { useCallback, useRef, useSyncExternalStore } from "react";
import type { Awareness } from "y-protocols/awareness";
import { useCollaborationProvider } from "./collaborationStore";

type AwarenessStates = ReturnType<Awareness["getStates"]>;

export function useUsers() {
  const { awareness } = useCollaborationProvider();

  const ref = useRef<AwarenessStates>();

  if (!ref.current) {
    ref.current = new Map(awareness.getStates());
  }

  const subscribe = useCallback(
    (listener: () => void) => {
      const onChange = () => {
        ref.current = awareness.getStates();
        listener();
      };

      awareness.on("change", onChange);
      return () => awareness.off("change", onChange);
    },
    [awareness],
  );

  const getSnapshot = useCallback(() => {
    if (!ref.current) {
      return new Map();
    }
    return ref.current;
  }, []);

  return useSyncExternalStore<AwarenessStates>(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
}
