import { Duplicados } from './models/Duplicados';
import { ItemModel } from './models/ItemProject';
export declare class validaProjeto {
    private log;
    projeto: ItemModel[];
    private comentFontPad;
    private ownerDb;
    private empresas;
    private local;
    private advplExtensions;
    protected listaDuplicados: any[];
    constructor(comentFontePad: string[], local: string, log?: boolean);
    validaProjeto(pathProject: string): Promise<any>;
    verificaDuplicados(): Promise<Duplicados>;
}
