import { SupportedErrorEvent } from '../container/Errors';
import { OriginalStackFrame } from './stack-frame';
import { ComponentStackFrame } from './parse-component-stack';
export type ReadyRuntimeError = {
    id: number;
    runtime: true;
    error: Error;
    frames: OriginalStackFrame[];
    componentStackFrames?: ComponentStackFrame[];
};
export declare function getErrorByType(ev: SupportedErrorEvent): Promise<ReadyRuntimeError>;
