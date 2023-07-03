import { Range } from '@tiptap/core';
import { ResolvedPos } from '@tiptap/pm/model';
export interface Trigger {
    char: string;
    allowSpaces: boolean;
    allowedPrefixes: string[] | null;
    startOfLine: boolean;
    $position: ResolvedPos;
}
export declare type SuggestionMatch = {
    range: Range;
    query: string;
    text: string;
} | null;
export declare function findSuggestionMatch(config: Trigger): SuggestionMatch;
