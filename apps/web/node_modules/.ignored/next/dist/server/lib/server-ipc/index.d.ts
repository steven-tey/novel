import type NextServer from '../../next-server';
export declare function createIpcServer(server: InstanceType<typeof NextServer>): Promise<{
    ipcPort: number;
    ipcServer: import('http').Server;
    ipcValidationKey: string;
}>;
export declare const createWorker: (ipcPort: number, ipcValidationKey: string, isNodeDebugging: boolean | 'brk' | undefined, type: 'pages' | 'app', useServerActions?: boolean) => Promise<any>;
