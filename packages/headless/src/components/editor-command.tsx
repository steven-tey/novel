import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useLayoutEffect, type ReactNode, useEffect, useRef, useState } from "react";
import tunnel from "tunnel-rat";
import type { SuggestionItem } from "../extensions";
import { novelStore } from "./editor";
import { Command } from "cmdk";

const t = tunnel();

export const queryAtom = atom("");

export const EditorCommandOut = ({ query }: { query: string }) => {
  const setQuery = useSetAtom(queryAtom, { store: novelStore });

  useEffect(() => {
    setQuery(query);
  }, [query, setQuery]);

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        const commandRef = document.querySelector("#slash-command");

        if (commandRef)
          commandRef.dispatchEvent(
            new KeyboardEvent("keydown", { key: e.key, cancelable: true, bubbles: true })
          );

        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return <t.Out />;
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

interface EditorCommandProps {
  children: ReactNode;
  className: string;
  shouldFilter?: boolean;
  filter?: (query: string, item: SuggestionItem) => Boolean;
}

export const EditorCommand = ({ children, className }: EditorCommandProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commandListRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useAtom(queryAtom);

  useLayoutEffect(() => {
    const container = commandListRef?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return (
    <t.In>
      <Command
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        id='slash-command'
        className={className}
        label='Command Menu'>
        <Command.Input value={query} onValueChange={setQuery} style={{ display: "none" }} />
        <Command.List ref={commandListRef}>{children}</Command.List>
      </Command>
    </t.In>
  );
};
