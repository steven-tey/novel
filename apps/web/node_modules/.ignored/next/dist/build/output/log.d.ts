export declare const prefixes: {
    wait: string;
    error: string;
    warn: string;
    ready: string;
    info: string;
    event: string;
    trace: string;
};
export declare function wait(...message: any[]): void;
export declare function error(...message: any[]): void;
export declare function warn(...message: any[]): void;
export declare function ready(...message: any[]): void;
export declare function info(...message: any[]): void;
export declare function event(...message: any[]): void;
export declare function trace(...message: any[]): void;
export declare function warnOnce(...message: any[]): void;
