import { useMemo, useRef, forwardRef } from "react";
import { EditorProvider } from "@tiptap/react";
import { Provider, createStore } from "jotai";
import tunnel from "tunnel-rat";
import { simpleExtensions } from "../extensions";
import { startImageUpload } from "../plugins/upload-images";
import { EditorCommandTunnelContext } from "./editor-command";
import type { FC, ReactNode } from "react";
import type { EditorProviderProps, JSONContent } from "@tiptap/react";

export interface EditorProps {
  readonly children: ReactNode;
  readonly className?: string;
}

interface EditorRootProps {
  readonly children: ReactNode;
}

export const novelStore = createStore();

export const EditorRoot: FC<EditorRootProps> = ({ children }) => {
  const tunnelInstance = useRef(tunnel()).current;

  return (
    <Provider store={novelStore}>
      <EditorCommandTunnelContext.Provider value={tunnelInstance}>
        {children}
      </EditorCommandTunnelContext.Provider>
    </Provider>
  );
};

export type EditorContentProps = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly initialContent?: JSONContent;
} & Omit<EditorProviderProps, "content">;

export const EditorContent = forwardRef<HTMLDivElement, EditorContentProps>(
  ({ className, children, initialContent, ...rest }, ref) => {
    const extensions = useMemo(() => {
      return [...simpleExtensions, ...(rest.extensions ?? [])];
    }, [rest.extensions]);

    return (
      <div ref={ref} className={className}>
        <EditorProvider
          {...rest}
          content={initialContent}
          extensions={extensions}
        >
          {children}
        </EditorProvider>
      </div>
    );
  }
);

export const defaultEditorProps: EditorProviderProps["editorProps"] = {
  handleDOMEvents: {
    keydown: (_view, event) => {
      // prevent default event listeners from firing when slash command is active
      if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        const slashCommand = document.querySelector("#slash-command");
        if (slashCommand) {
          return true;
        }
      }
    },
  },
  handlePaste: (view, event) => {
    if (
      event.clipboardData &&
      event.clipboardData.files &&
      event.clipboardData.files[0]
    ) {
      event.preventDefault();
      const file = event.clipboardData.files[0];
      const pos = view.state.selection.from;

      startImageUpload(file, view, pos);
      return true;
    }
    return false;
  },
  handleDrop: (view, event, _slice, moved) => {
    if (
      !moved &&
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files[0]
    ) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      const coordinates = view.posAtCoords({
        left: event.clientX,
        top: event.clientY,
      });
      // here we deduct 1 from the pos or else the image will create an extra node
      startImageUpload(file, view, coordinates?.pos || 0 - 1);
      return true;
    }
    return false;
  },
};
