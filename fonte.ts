import { Uri } from 'vscode';
export enum Tipos {
  'Function',
  'User Function',
  'Class'
}
export class Fonte {
  public fonte: Uri;
  public funcoes: Funcao[];
  constructor(fonte?: Uri) {
    this.fonte = fonte;
    this.funcoes = [];
  }
  public addFunction(tipo: Tipos, nome: string, linha: number) {
    this.funcoes.push(new Funcao(tipo, nome, linha));
  }
}
export class Funcao {
  public tipo: Tipos;
  public nome: string;
  public linha: number;
  constructor(tipo: Tipos, nome: string, linha: number) {
    this.tipo = tipo;
    this.nome = nome;
    this.linha = linha;
  }
}
