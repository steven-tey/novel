import { useEffect, useCallback } from "react";

const useEscapeKeyListener = (onEscapePress: () => void) => {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapePress();
      }
    },
    [onEscapePress],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);
};

export default useEscapeKeyListener;
