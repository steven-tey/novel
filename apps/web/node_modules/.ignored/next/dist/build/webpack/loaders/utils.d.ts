export declare function isClientComponentEntryModule(mod: {
    resource: string;
    buildInfo?: any;
}): any;
export declare const regexCSS: RegExp;
export declare function isCSSMod(mod: {
    resource: string;
    type?: string;
    loaders?: {
        loader: string;
    }[];
}): boolean;
export declare function getActions(mod: {
    resource: string;
    buildInfo?: any;
}): undefined | string[];
export declare function generateActionId(filePath: string, exportName: string): string;
export declare function encodeToBase64<T extends {}>(obj: T): string;
export declare function decodeFromBase64<T extends {}>(str: string): T;
