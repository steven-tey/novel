import type { ReactNode } from "react";
import tunnel from "tunnel-rat";

const t = tunnel();

export const EditorCommandOut = () => {
  return (
    <div id='slash-command'>
      ddasd
      <t.Out />
    </div>
  );
};

interface EditorCommandProps {
  children: ReactNode;
}

export const EditorCommand = ({ children }: EditorCommandProps) => {
  return <t.In>{children}</t.In>;
};
