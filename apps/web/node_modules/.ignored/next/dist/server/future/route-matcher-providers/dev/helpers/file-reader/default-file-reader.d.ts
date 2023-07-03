import { FileReader } from './file-reader';
export declare class DefaultFileReader implements FileReader {
    read(dir: string): Promise<ReadonlyArray<string>>;
}
