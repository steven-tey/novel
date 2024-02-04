import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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

interface Items {
  title: string;
  description: string;
  icon: ReactNode;
}

export type EditorCommandProps = {
  items: Items[];
  command: any;
  editor: any;
  range: any;
  Element: FunctionComponent<any>;
  className: string;
};
export const EditorCommand = ({
  items,
  command,
  editor,
  range,
  Element,
  className,
}: EditorCommandProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          const item = items[selectedIndex];
          command(item);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [command, items, selectedIndex, setSelectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div id='slash-command' ref={commandListContainer} className={className}></div>
  ) : null;
};
