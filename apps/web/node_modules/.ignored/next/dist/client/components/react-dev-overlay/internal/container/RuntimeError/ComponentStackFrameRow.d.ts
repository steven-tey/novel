import React from 'react';
import type { ComponentStackFrame } from '../../helpers/parse-component-stack';
export declare function ComponentStackFrameRow({ componentStackFrame: { component, file, lineNumber, column }, }: {
    componentStackFrame: ComponentStackFrame;
}): React.JSX.Element;
