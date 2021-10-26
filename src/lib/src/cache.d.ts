import { FileCache } from './models/FileCache';
export declare class Cache {
    private fileCache;
    private tmpFolder;
    filesInCache: FileCache[];
    constructor(fileCache: string);
    addFile(file: FileCache): void;
    delFile(fsPath: string): void;
}
