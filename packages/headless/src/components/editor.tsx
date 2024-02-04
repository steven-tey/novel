import React, { Children, useEffect } from "react";
import { EditorProvider, EditorProviderProps } from "@tiptap/react";
import { Provider, atom, useAtomValue, useSetAtom } from "jotai";
import { AnyExtension } from "@tiptap/core";
import { simpleExtensions } from "../extensions";

interface EditorProps {
  children: React.ReactNode;
  className?: string;
}

export const extensionsAtom = atom<AnyExtension[]>([]);

export const Editor = ({ children }: EditorProps) => {
  return <Provider>{children}</Provider>;
};

export const EditorContent = ({
  className,
  children,
  ...rest
}: EditorProps & EditorProviderProps) => {
  const extensions = useAtomValue(extensionsAtom);
  return (
    <div className={className}>
      {extensions.length !== 0 && (
        <EditorProvider {...rest} extensions={extensions}>
          {children}
        </EditorProvider>
      )}
    </div>
  );
};

interface EditorExtensionProps {
  extension: AnyExtension;
}
export const EditorExension = ({ extension }: EditorExtensionProps) => {
  useEffect(() => {}, [extension]);
  return null;
};

export const EditorExtenions = ({ children }: EditorProps) => {
  const setExtensions = useSetAtom(extensionsAtom);
  useEffect(() => {
    const extensions = Children.toArray(children).map((child) => {
      if (React.isValidElement(child)) {
        const extension = child.props.extension;
        return extension;
      }
      return null;
    }) as AnyExtension[];
    setExtensions([...extensions, ...simpleExtensions]);
  }, [children, setExtensions]);

  return <>{children}</>;
};
