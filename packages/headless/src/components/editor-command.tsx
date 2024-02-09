import { atom, useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import tunnel from "tunnel-rat";
import { novelStore } from "./editor";
import { Command } from "cmdk";
import type { Range } from "@tiptap/core";

const t = tunnel();

export const queryAtom = atom("");
export const rangeAtom = atom<Range | null>(null);

export const EditorCommandOut = ({ query, range }: { query: string; range: Range }) => {
  const setQuery = useSetAtom(queryAtom, { store: novelStore });
  const setRange = useSetAtom(rangeAtom, { store: novelStore });

  useEffect(() => {
    setQuery(query);
  }, [query, setQuery]);

  useEffect(() => {
    setRange(range);
  }, [range, setRange]);

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

export const EditorCommand = ({
  children,
  className,
  ...rest
}: ComponentPropsWithoutRef<typeof Command>) => {
  const commandListRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useAtom(queryAtom);

  return (
    <t.In>
      <Command
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        id='slash-command'
        className={className}
        {...rest}>
        <Command.Input value={query} onValueChange={setQuery} style={{ display: "none" }} />
        <Command.List ref={commandListRef}>{children}</Command.List>
      </Command>
    </t.In>
  );
};
