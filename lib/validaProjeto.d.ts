import { Duplicados } from './models/Duplicados';
import { ItemModel } from './models/ItemProject';
export declare class ValidaProjeto {
    private log;
    projeto: ItemModel[];
    comentFontPad: string[];
    ownerDb: string[];
    empresas: string[];
    local: any;
    version: string;
    private advplExtensions;
    protected listaDuplicados: {
        files: any[];
        functions: any[];
    };
    constructor(comentFontePad: string[], local: string, log?: boolean);
    validaProjeto(pathsProject: string[]): Promise<ValidaProjeto>;
    criaPromises(pathsProject: string[], startTime?: any): Promise<unknown>;
    verificaDuplicados(): Promise<Duplicados>;
    contaErros(): any;
}
