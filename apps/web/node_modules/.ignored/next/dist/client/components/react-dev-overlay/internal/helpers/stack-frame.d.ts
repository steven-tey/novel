import { StackFrame } from 'next/dist/compiled/stacktrace-parser';
export type OriginalStackFrame = {
    error: true;
    reason: string;
    external: false;
    expanded: false;
    sourceStackFrame: StackFrame;
    originalStackFrame: null;
    originalCodeFrame: null;
    sourcePackage?: string;
} | {
    error: false;
    reason: null;
    external: false;
    expanded: boolean;
    sourceStackFrame: StackFrame;
    originalStackFrame: StackFrame;
    originalCodeFrame: string | null;
    sourcePackage?: string;
} | {
    error: false;
    reason: null;
    external: true;
    expanded: false;
    sourceStackFrame: StackFrame;
    originalStackFrame: null;
    originalCodeFrame: null;
    sourcePackage?: string;
};
export declare function getOriginalStackFrame(source: StackFrame, type: 'server' | 'edge-server' | null, errorMessage: string): Promise<OriginalStackFrame>;
export declare function getOriginalStackFrames(frames: StackFrame[], type: 'server' | 'edge-server' | null, errorMessage: string): Promise<OriginalStackFrame[]>;
export declare function getFrameSource(frame: StackFrame): string;
