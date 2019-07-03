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
const Erro_1 = require("./models/Erro");
const fonte_1 = require("./fonte");
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
        this.listaDuplicados = { files: [], functions: [] };
        this.local = local;
        this.comentFontPad = comentFontePad;
        this.ownerDb = [];
        this.empresas = [];
    }
    validaProjeto(pathProject) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
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
                    });
                    // verifica duplicados
                    this.verificaDuplicados().then(() => {
                        if (this.log) {
                            // calcula tempo gasto
                            let endTime = new Date();
                            let timeDiff = endTime - startTime; //in ms
                            // strip the ms
                            timeDiff /= 1000;
                            // get seconds
                            let seconds = Math.round(timeDiff);
                            console.log('Terminou! (' + seconds + ' segundos)');
                        }
                        resolve(this);
                    });
                });
            }));
        });
    }
    verificaDuplicados() {
        return new Promise((resolve) => {
            let listaFuncoes = [];
            let funcoesDuplicadas = [];
            let listaArquivos = [];
            let arquivosDuplicados = [];
            this.projeto.forEach((item) => {
                let fonte = item.fonte;
                //verifica se o fonte ainda existe
                try {
                    fileSystem.statSync(fonte.fonte);
                    fonte.funcoes.forEach((funcao) => {
                        // não aponta como duplicadas as static Functions ou metodos
                        if (funcao.tipo !== fonte_1.Tipos['Static Function'] &&
                            funcao.tipo !== fonte_1.Tipos.Method) {
                            let functionName = (funcao.nome + funcao.tipo).toUpperCase();
                            //monta lista de funções duplicadas
                            if (listaFuncoes.indexOf(functionName) === -1) {
                                listaFuncoes.push(functionName);
                            }
                            else if (funcoesDuplicadas.indexOf(functionName) === -1) {
                                funcoesDuplicadas.push(functionName);
                            }
                        }
                    });
                    let fileName = fonte.fonte
                        .replace(/\\/g, '/')
                        .substring(fonte.fonte.replace(/\\/g, '/').lastIndexOf('/') + 1)
                        .toUpperCase();
                    //monta lista de qrquivos duplicados
                    if (listaArquivos.indexOf(fileName) === -1) {
                        listaArquivos.push(fileName);
                    }
                    else if (arquivosDuplicados.indexOf(fileName) === -1) {
                        arquivosDuplicados.push(fileName);
                    }
                }
                catch (e) {
                    if (e.code === 'ENOENT') {
                        item.content = '';
                        item.errors = [];
                        item.fonte.funcoes = [];
                    }
                    else {
                        console.log(`Erro ao validar : ${fonte.fonte}`);
                        console.log(e);
                    }
                }
            });
            // guarda lista de duplicados
            let duplicadosOld = JSON.parse(JSON.stringify(this.listaDuplicados));
            this.listaDuplicados.files = JSON.parse(JSON.stringify(arquivosDuplicados));
            this.listaDuplicados.functions = JSON.parse(JSON.stringify(funcoesDuplicadas));
            //Procura o que mudou
            let filesIncluidos = this.listaDuplicados.files.filter(x => duplicadosOld.files.indexOf(x) === -1);
            let filesExcluidos = duplicadosOld.files.filter(x => this.listaDuplicados.files.indexOf(x) === -1);
            let functionsIncluidos = this.listaDuplicados.functions.filter(x => duplicadosOld.functions.indexOf(x) === -1);
            let functionsExcluidos = duplicadosOld.functions.filter(x => this.listaDuplicados.functions.indexOf(x) === -1);
            // marca duplicados
            this.projeto.forEach((item) => {
                let fonte = item.fonte;
                fonte.funcoes.forEach((funcao) => {
                    let functionName = (funcao.nome + funcao.tipo).toUpperCase();
                    //adiciona o erro
                    if (functionsIncluidos.indexOf(functionName) > -1) {
                        item.errors.push(new Erro_1.Erro(funcao.linha, funcao.linha, traduz('validaAdvpl.functionDuplicate', this.local), Erro_1.Severity.Error));
                    }
                    if (functionsExcluidos.indexOf(functionName) > -1) {
                        item.errors = item.errors.filter((erro) => {
                            return (erro.message !==
                                traduz('validaAdvpl.functionDuplicate', this.local) ||
                                funcao.linha !== erro.startLine);
                        });
                    }
                });
                let fileName = fonte.fonte
                    .replace(/\\/g, '/')
                    .substring(fonte.fonte.replace(/\\/g, '/').lastIndexOf('/') + 1)
                    .toUpperCase();
                //adiciona o erro
                if (filesIncluidos.indexOf(fileName) > -1) {
                    item.errors.push(new Erro_1.Erro(0, 0, traduz('validaAdvpl.fileDuplicate', this.local), Erro_1.Severity.Error));
                }
                else if (filesExcluidos.indexOf(fileName) > -1) {
                    item.errors = item.errors.filter((erro) => {
                        return (erro.message !== traduz('validaAdvpl.fileDuplicate', this.local));
                    });
                }
            });
            if (this.log) {
                let errosContagem = this.contaErros();
                console.log(`\t${errosContagem.errors} Errors`);
                console.log(`\t${errosContagem.warnings} Warnings`);
                console.log(`\t${errosContagem.information} Informations`);
                console.log(`\t${errosContagem.hint} Hints`);
            }
            resolve();
        });
    }
    contaErros() {
        let erros = { errors: 0, warnings: 0, information: 0, hint: 0 };
        this.projeto.forEach((item) => {
            item.errors.forEach((erro) => {
                if (erro.severity === Erro_1.Severity.Error) {
                    erros.errors++;
                }
                else if (erro.severity === Erro_1.Severity.Warning) {
                    erros.warnings++;
                }
                else if (erro.severity === Erro_1.Severity.Information) {
                    erros.information++;
                }
                else if (erro.severity === Erro_1.Severity.Hint) {
                    erros.hint++;
                }
            });
        });
        return erros;
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