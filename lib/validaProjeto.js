"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const erros_1 = require("./erros");
const ItemProject_1 = require("./models/ItemProject");
const globby = __importStar(require("globby"));
const fileSystem = __importStar(require("fs"));
const validaAdvpl_1 = require("./validaAdvpl");
const package_json_1 = require("./package.json");
class ValidaProjeto {
    constructor(comentFontePad, local, log = true) {
        this.log = log;
        this.version = package_json_1.version;
        this.advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
        this.listaDuplicados = [];
        this.local = local;
        this.comentFontPad = comentFontePad;
        this.ownerDb = [];
        this.empresas = [];
    }
    validaProjeto(pathProject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let erros = 0;
                let warnings = 0;
                let hint = 0;
                let information = 0;
                this.projeto = [];
                // monta expressão para buscar arquivos
                let globexp = [];
                for (var i = 0; i < this.advplExtensions.length; i++) {
                    globexp.push(`**/*.${this.advplExtensions[i]}`);
                }
                // busca arquivos na pasta
                let files = yield globby.sync(globexp, {
                    cwd: pathProject,
                    caseSensitiveMatch: false
                });
                // valida arquivos
                let promisses = [];
                let startTime = new Date();
                if (this.log) {
                    console.log(startTime);
                    console.log('Analise de Projeto: ' + pathProject);
                }
                files.forEach((fileName) => {
                    let valida = new validaAdvpl_1.ValidaAdvpl(this.comentFontPad, this.local, this.log);
                    valida.ownerDb = this.ownerDb;
                    valida.empresas = this.empresas;
                    if (this.log) {
                        console.log('Arquivo: ' + fileName);
                    }
                    let conteudo = fileSystem.readFileSync(pathProject + '\\' + fileName, 'latin1');
                    promisses.push(valida.validacao(conteudo, pathProject + '\\' + fileName));
                });
                Promise.all(promisses).then((validacoes) => {
                    validacoes.forEach((validacao) => {
                        let itemProjeto = new ItemProject_1.ItemModel();
                        itemProjeto.content = validacao.conteudoFonte;
                        itemProjeto.errors = validacao.aErros;
                        itemProjeto.fonte = validacao.fonte;
                        this.projeto.push(itemProjeto);
                        erros += validacao.error;
                        warnings += validacao.warning;
                        information += validacao.information;
                        hint += validacao.hint;
                    });
                    // verifica duplicados
                    this.verificaDuplicados().then(() => {
                        this.projeto.forEach((item) => {
                            let fonte = item.fonte;
                            if (fonte.duplicado) {
                                item.errors.push(new erros_1.Erro(0, 0, traduz('validaAdvpl.fileDuplicate', this.local), erros_1.Severity.Error));
                                erros++;
                            }
                            fonte.funcoes.forEach((funcao) => {
                                if (funcao.duplicada) {
                                    item.errors.push(new erros_1.Erro(funcao.linha, funcao.linha, traduz('validaAdvpl.functionDuplicate', this.local), erros_1.Severity.Error));
                                    erros++;
                                }
                            });
                        });
                    });
                    if (this.log) {
                        console.log(`\t${erros} Errors`);
                        console.log(`\t${warnings} Warnings`);
                        console.log(`\t${information} Informations`);
                        console.log(`\t${hint} Hints`);
                        // calcula tempo gasto
                        let endTime = new Date();
                        let timeDiff = endTime - startTime; //in ms
                        // strip the ms
                        timeDiff /= 1000;
                        // get seconds
                        let seconds = Math.round(timeDiff);
                        console.log('Terminou! (' + seconds + ' segundos)');
                        resolve(this);
                    }
                });
            }));
        });
    }
    verificaDuplicados() {
        return new Promise(() => {
            let listaFuncoes = [];
            let listaArquivos = [];
            this.projeto.forEach((item) => {
                let fonte = item.fonte;
                //verifica se o fonte ainda existe
                try {
                    fileSystem.statSync(fonte.fonte);
                }
                catch (_a) { }
                fonte.funcoes.forEach((funcao) => {
                    let functionName = (funcao.nome + funcao.tipo).toUpperCase();
                    //monta lista de funções duplicadas
                    if (listaFuncoes.indexOf(functionName) === -1) {
                        listaFuncoes.push(functionName);
                    }
                    else {
                        funcao.duplicada = true;
                    }
                    let fileName = fonte.fonte
                        .substring(fonte.fonte.lastIndexOf('/') + 1)
                        .toUpperCase();
                    //monta lista de qrquivos duplicados
                    if (listaArquivos.indexOf(fileName) === -1) {
                        listaFuncoes.push(fileName);
                    }
                    else {
                        fonte.duplicado = true;
                    }
                });
            });
        });
    }
}
exports.ValidaProjeto = ValidaProjeto;
function traduz(key, local) {
    let locales = ['en', 'pt-br'];
    let i18n = require('i18n');
    i18n.configure({
        locales: locales,
        directory: __dirname + '/locales'
    });
    i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
    return i18n.__(key);
}
//# sourceMappingURL=validaProjeto.js.map