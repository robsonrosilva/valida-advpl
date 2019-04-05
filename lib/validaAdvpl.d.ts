import { Fonte } from "./fonte";
import { Uri } from "vscode";
export declare class ValidaAdvpl {
    comentFontPad: any;
    error: number;
    warning: number;
    information: number;
    hint: number;
    versao: string;
    includes: any[];
    aErros: any[];
    ownerDb: string[];
    empresas: string[];
    fonte: Fonte;
    private local;
    constructor(comentFontePad: string[], local: string);
    validacao(texto: String, path: Uri): void;
}
