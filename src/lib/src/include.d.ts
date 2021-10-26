import { ValidaAdvpl } from './validaAdvpl';
export declare class Include {
    private includeExpressoes;
    private includesObsoletos;
    protected local: any;
    constructor(local: any);
    valida(objetoValidacao: ValidaAdvpl, conteudoFile: String): void;
}
