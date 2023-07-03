export type CliCommand = (argv?: string[]) => void;
export declare const commands: {
    [command: string]: () => Promise<CliCommand>;
};
