import {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
} from "react";
import { Editor, Range, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Code,
  CheckSquare,
  Table,
} from "lucide-react";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms: string[];
  // eslint-disable-next-line no-unused-vars
  command: (props: CommandProps) => void;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

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

const CommandList = ({
  items,
  command,
}: {
  items: CommandItemProps[];
  command: any;
  editor: any;
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    },
    [command, items],
  );

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
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

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
    <div
      id="slash-command"
      ref={commandListContainer}
      className="novel-z-50 novel-h-auto novel-max-h-[330px] novel-w-72 novel-overflow-y-auto novel-rounded-md novel-border novel-border-stone-200 novel-bg-white novel-px-1 novel-py-2 novel-shadow-md novel-transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`novel-flex novel-w-full novel-items-center novel-space-x-2 novel-rounded-md novel-px-2 novel-py-1 novel-text-left novel-text-sm novel-text-stone-900 hover:novel-bg-stone-100 ${
              index === selectedIndex
                ? "novel-bg-stone-100 novel-text-stone-900"
                : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="novel-flex novel-h-10 novel-w-10 novel-items-center novel-justify-center novel-rounded-md novel-border novel-border-stone-200 novel-bg-white">
              {item.icon}
            </div>
            <div>
              <p className="novel-font-medium">{item.title}</p>
              <p className="novel-text-xs novel-text-stone-500">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

interface CreateSlashCommandProps {
  suggestionItems?: CommandItemProps[];
}

export const createSlashCommand = ({
  suggestionItems = [],
}: CreateSlashCommandProps) => {
  const defaultSuggestionItems: CommandItemProps[] = [
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <Text size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: "To-do List",
      description: "Track tasks with a to-do list.",
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large"],
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["unordered", "point"],
      icon: <List size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered"],
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quote.",
      searchTerms: ["blockquote"],
      icon: <TextQuote size={18} />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <Code size={18} />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Table",
      description: "Add a table view to organize data.",
      searchTerms: ["table"],
      icon: <Table size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
  ];
  const SlashCommand = Command.configure({
    suggestion: {
      items: ({ query }: { query: string }) => {
        return [...defaultSuggestionItems, ...suggestionItems].filter(
          (item) => {
            if (typeof query === "string" && query.length > 0) {
              const search = query.toLowerCase();
              return (
                item.title.toLowerCase().includes(search) ||
                item.description.toLowerCase().includes(search) ||
                (item.searchTerms &&
                  item.searchTerms.some((term: string) =>
                    term.includes(search),
                  ))
              );
            }
            return true;
          },
        );
      },
      render: renderItems,
    },
  });

  return SlashCommand;
};
