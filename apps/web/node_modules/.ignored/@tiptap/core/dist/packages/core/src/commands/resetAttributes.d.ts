import { MarkType, NodeType } from '@tiptap/pm/model';
import { RawCommands } from '../types';
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        resetAttributes: {
            /**
             * Resets some node attributes to the default value.
             */
            resetAttributes: (typeOrName: string | NodeType | MarkType, attributes: string | string[]) => ReturnType;
        };
    }
}
export declare const resetAttributes: RawCommands['resetAttributes'];
