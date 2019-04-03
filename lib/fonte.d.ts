import { Uri } from "vscode";
export declare enum Tipos {
    "Function" = 0,
    "User Function" = 1,
    "Class" = 2
}
export declare class Fonte {
    fonte: Uri;
    funcoes: Funcao[];
    constructor(fonte: Uri);
    addFunction(tipo: Tipos, nome: string, linha: number): void;
}
export declare class Funcao {
    tipo: Tipos;
    nome: string;
    linha: number;
    constructor(tipo: Tipos, nome: string, linha: number);
}
