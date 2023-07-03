import React from 'react';
type EditorLinkProps = {
    file: string;
    isSourceFile: boolean;
    location?: {
        line: number;
        column: number;
    };
};
export declare function EditorLink({ file, isSourceFile, location }: EditorLinkProps): React.JSX.Element;
export {};
