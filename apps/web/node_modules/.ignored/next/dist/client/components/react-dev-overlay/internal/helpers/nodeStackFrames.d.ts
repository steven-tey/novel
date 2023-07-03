import { StackFrame } from 'next/dist/compiled/stacktrace-parser';
export declare function getFilesystemFrame(frame: StackFrame): StackFrame;
export declare function getErrorSource(error: Error): 'server' | 'edge-server' | null;
type ErrorType = 'edge-server' | 'server';
export declare function decorateServerError(error: Error, type: ErrorType): void;
export declare function getServerError(error: Error, type: ErrorType): Error;
export {};
