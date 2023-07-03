export type ComponentStackFrame = {
    component: string;
    file?: string;
    lineNumber?: number;
    column?: number;
};
export declare function parseComponentStack(componentStack: string): ComponentStackFrame[];
