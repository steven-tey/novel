import { SpanId } from '../shared';
type Reporter = {
    flushAll: () => Promise<void> | void;
    report: (spanName: string, duration: number, timestamp: number, id: SpanId, parentId?: SpanId, attrs?: Object, startTime?: number) => void;
};
declare class MultiReporter implements Reporter {
    private reporters;
    constructor(reporters: Reporter[]);
    flushAll(): Promise<void>;
    report(spanName: string, duration: number, timestamp: number, id: SpanId, parentId?: SpanId, attrs?: Object, startTime?: number): void;
}
export declare const reporter: MultiReporter;
export {};
