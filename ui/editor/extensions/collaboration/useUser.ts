import { useState, useCallback, useEffect } from "react";

import { useCollaborationProvider } from "./collaborationStore";
import { getRandomColor } from "./getRandomColor";

export function useUser() {
  const yProvider = useCollaborationProvider();
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
  }, [yProvider]);

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
  }, [yProvider]);

  return {
    setName,
    name: currentUser.name,
  };
}
