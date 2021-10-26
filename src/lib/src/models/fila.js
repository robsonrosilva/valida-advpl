"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItensValidacao = exports.Fila = void 0;
const projectStatus_1 = require("../../src/models/projectStatus");
class Fila {
    constructor() {
        this.status = new projectStatus_1.ProjectStatus();
        this.list = [];
        this.returnList = [];
    }
    run() {
        return new Promise((resolve) => {
            // monta listas de processamento
            const listaProcessamento = [[]];
            //junta de 10 em 10
            for (var i = 0; i < this.list.length; i++) {
                if (listaProcessamento[listaProcessamento.length - 1].length < 10) {
                    listaProcessamento[listaProcessamento.length - 1].push(this.list[i]);
                }
                else {
                    listaProcessamento.push([this.list[i]]);
                }
            }
            // Processa de 10 em 10
            const runGroup = (item) => {
                if (item == listaProcessamento.length) {
                    resolve(this.returnList);
                    return;
                }
                console.log('' + (item + 1) + '/' + listaProcessamento.length);
                let promisses = [];
                for (var i = 0; i < listaProcessamento[item].length; i++) {
                    promisses.push(listaProcessamento[item][i].validaAdvpl.validacao(listaProcessamento[item][i].content, listaProcessamento[item][i].fileName, listaProcessamento[item][i].project));
                }
                Promise.all(promisses).then((validacoes) => {
                    for (var i = 0; i < validacoes.length; i++) {
                        this.returnList.push(validacoes[i]);
                    }
                    runGroup(item + 1);
                });
            };
            runGroup(0);
        });
    }
}
exports.Fila = Fila;
class ItensValidacao {
    constructor(fileName, project, content, validaAdvpl) {
        this.finally = false;
        this.running = false;
        this.fileName = fileName;
        this.project = project;
        this.content = content;
        this.validaAdvpl = validaAdvpl;
    }
}
exports.ItensValidacao = ItensValidacao;
//# sourceMappingURL=fila.js.map