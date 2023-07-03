export type ClientComponentImports = string[];
export type CssImports = Record<string, string[]>;
export type NextFlightClientEntryLoaderOptions = {
    modules: ClientComponentImports;
    /** This is transmitted as a string to `getOptions` */
    server: boolean | 'true' | 'false';
};
export default function transformSource(this: any): string;
