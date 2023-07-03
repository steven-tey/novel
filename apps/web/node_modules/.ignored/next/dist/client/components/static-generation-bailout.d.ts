export type StaticGenerationBailout = (reason: string, opts?: {
    dynamic?: string;
    link?: string;
}) => boolean | never;
export declare const staticGenerationBailout: StaticGenerationBailout;
