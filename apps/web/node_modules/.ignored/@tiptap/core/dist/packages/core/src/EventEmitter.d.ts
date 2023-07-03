declare type StringKeyOf<T> = Extract<keyof T, string>;
declare type CallbackType<T extends Record<string, any>, EventName extends StringKeyOf<T>> = T[EventName] extends any[] ? T[EventName] : [T[EventName]];
declare type CallbackFunction<T extends Record<string, any>, EventName extends StringKeyOf<T>> = (...props: CallbackType<T, EventName>) => any;
export declare class EventEmitter<T extends Record<string, any>> {
    private callbacks;
    on<EventName extends StringKeyOf<T>>(event: EventName, fn: CallbackFunction<T, EventName>): this;
    protected emit<EventName extends StringKeyOf<T>>(event: EventName, ...args: CallbackType<T, EventName>): this;
    off<EventName extends StringKeyOf<T>>(event: EventName, fn?: CallbackFunction<T, EventName>): this;
    protected removeAllListeners(): void;
}
export {};
