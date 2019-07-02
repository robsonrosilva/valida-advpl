export enum Tipos {
  'Function',
  'User Function',
  'Class',
  'Method',
  'Static Function'
}
export class Fonte {
  public fonte: string;
  public funcoes: Funcao[];
  public duplicado: boolean;
  constructor(fonte?: string) {
    this.fonte = fonte;
    this.funcoes = [];
    this.duplicado = false;
  }
  public addFunction(tipo: Tipos, nome: string, linha: number) {
    this.funcoes.push(new Funcao(tipo, nome, linha));
  }
  public addVariavel(variavel: string) {
    this.funcoes[this.funcoes.length - 1].variaveisLocais.push(variavel);
  }
}
export class Funcao {
  public tipo: Tipos;
  public nome: string;
  public linha: number;
  public duplicada: boolean;
  //Armazena as variáveis locais não usadas
  public variaveisLocais: string[];
  constructor(tipo: Tipos, nome: string, linha: number) {
    this.tipo = tipo;
    this.nome = nome;
    this.linha = linha;
    this.duplicada = false;
    this.variaveisLocais = [];
  }
}
