import { Erro } from './models/Erro';
import { Fonte } from './fonte';
import { Cache } from './cache';
export declare class ValidaAdvpl {
  private log;
  comentFontPad: string[];
  error: number;
  warning: number;
  information: number;
  hint: number;
  includes: any[];
  aErros: Erro[];
  ownerDb: string[];
  empresas: string[];
  fonte: Fonte;
  version: string;
  conteudoFonte: string;
  private local;
  cache: Cache;
  constructor(
    comentFontePad: string[],
    local: string,
    cache: Cache,
    log?: boolean
  );
  validacao(texto: string, path: string): Promise<ValidaAdvpl>;
}
