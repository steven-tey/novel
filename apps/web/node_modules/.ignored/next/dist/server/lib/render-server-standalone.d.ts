import type { IncomingMessage, ServerResponse } from 'http';
export declare const createServerHandler: ({ port, hostname, dir, dev, minimalMode, }: {
    port: number;
    hostname: string;
    dir: string;
    dev?: boolean | undefined;
    minimalMode: boolean;
}) => Promise<(req: IncomingMessage, res: ServerResponse) => Promise<void>>;
