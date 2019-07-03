"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tipos;
(function (Tipos) {
    Tipos[Tipos["Function"] = 0] = "Function";
    Tipos[Tipos["User Function"] = 1] = "User Function";
    Tipos[Tipos["Class"] = 2] = "Class";
    Tipos[Tipos["Method"] = 3] = "Method";
    Tipos[Tipos["Static Function"] = 4] = "Static Function";
})(Tipos = exports.Tipos || (exports.Tipos = {}));
class Fonte {
    constructor(fonte) {
        this.fonte = fonte;
        this.funcoes = [];
    }
    addFunction(tipo, nome, linha) {
        this.funcoes.push(new Funcao(tipo, nome, linha));
    }
    addVariavel(variavel) {
        this.funcoes[this.funcoes.length - 1].variaveisLocais.push(variavel);
    }
}
exports.Fonte = Fonte;
class Funcao {
    constructor(tipo, nome, linha) {
        this.tipo = tipo;
        this.nome = nome;
        this.linha = linha;
        this.variaveisLocais = [];
    }
}
exports.Funcao = Funcao;
//# sourceMappingURL=fonte.js.map