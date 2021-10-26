export declare enum Tipos {
    'Function' = 0,
    'User Function' = 1,
    'Class' = 2,
    'Method' = 3,
    'Static Function' = 4
}
export declare class Fonte {
    fonte: string;
    funcoes: Funcao[];
    constructor(fonte?: string);
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
