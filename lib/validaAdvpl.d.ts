import { Fonte } from './fonte';
export declare class ValidaAdvpl {
    private log;
    comentFontPad: string[];
    error: number;
    warning: number;
    information: number;
    hint: number;
    includes: any[];
    aErros: any[];
    ownerDb: string[];
    empresas: string[];
    fonte: Fonte;
    version: string;
    conteudoFonte: string;
    private local;
    constructor(comentFontePad: string[], local: string, log?: boolean);
    validacao(texto: string, path: string): Promise<ValidaAdvpl>;
}
