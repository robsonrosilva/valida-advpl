import { Uri } from 'vscode';
export declare enum Tipos {
    'Function' = 0,
    'User Function' = 1,
    'Class' = 2
}
export declare class Fonte {
    fonte: Uri;
    funcoes: Funcao[];
    constructor(fonte?: Uri);
    addFunction(tipo: Tipos, nome: string, linha: number): void;
    addVariavel(variavel: string): void;
}
export declare class Funcao {
    tipo: Tipos;
    nome: string;
    linha: number;
    variaveisLocais: string[];
    constructor(tipo: Tipos, nome: string, linha: number);
}
