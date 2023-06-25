import { useEffect, useState } from "react";

import { useCollaborationProvider } from "./collaborationStore";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

export function useConnectionStatus() {
  const yProvider = useCollaborationProvider();

  const computedStatus = yProvider.wsconnected
    ? "connected"
    : yProvider.wsconnecting
    ? "connecting"
    : "disconnected";

  const [state, setState] = useState<ConnectionStatus>(computedStatus);
  if (state !== computedStatus) {
    setState(computedStatus);
  }

  useEffect(() => {
    yProvider.on("status", (event: { status: ConnectionStatus }) => {
      setState(event.status);
    });
  }, [yProvider]);

  return state;
}
