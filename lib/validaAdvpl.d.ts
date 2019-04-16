import { Fonte } from './fonte';
import { Uri } from 'vscode';
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
    private local;
    constructor(comentFontePad: string[], local: string, log?: boolean);
    validacao(texto: String, path: Uri): void;
}
