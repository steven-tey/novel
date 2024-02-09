import React, { useMemo } from "react";
import { EditorProvider, type EditorProviderProps } from "@tiptap/react";
import { Provider, createStore } from "jotai";
import { simpleExtensions } from "../extensions";
import { startImageUpload } from "../plugins/upload-images";

export interface EditorProps {
  children: React.ReactNode;
  className?: string;
}

export const novelStore = createStore();

export const EditorRoot = ({ children }: EditorProps) => {
  return <Provider store={novelStore}>{children}</Provider>;
};

export const EditorContent = ({
  className,
  children,
  ...rest
}: EditorProps & EditorProviderProps) => {
  const extensions = useMemo(() => {
    return [...simpleExtensions, ...(rest.extensions ?? [])];
  }, [rest.extensions]);

  return (
    <div className={className}>
      <EditorProvider {...rest} extensions={extensions}>
        {children}
      </EditorProvider>
    </div>
  );
};

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
    if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
      event.preventDefault();
      const file = event.clipboardData.files[0];
      const pos = view.state.selection.from;

      startImageUpload(file, view, pos);
      return true;
    }
    return false;
  },
  handleDrop: (view, event, _slice, moved) => {
    if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
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
