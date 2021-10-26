"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidaProjeto = void 0;
const Erro_1 = require("./models/Erro");
const fonte_1 = require("./fonte");
const ItemProject_1 = require("./models/ItemProject");
const projectStatus_1 = require("./models/projectStatus");
const fila_1 = require("./models/fila");
const globby = __importStar(require("globby"));
const fileSystem = __importStar(require("fs"));
const validaAdvpl_1 = require("./validaAdvpl");
const package_json_1 = require("./../package.json");
const cache_1 = require("./cache");
function PrintTempo(startTime) {
    // calcula tempo gasto
    let endTime = new Date();
    let timeDiff = endTime - startTime; //in ms
    // strip the ms
    timeDiff /= 1000;
    // get seconds
    let seconds = Math.round(timeDiff);
    return seconds;
}
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
    validaProjeto(pathsProject, status = new projectStatus_1.ProjectStatus()) {
        return new Promise((resolve) => {
            this.projeto = [];
            let startTime = new Date();
            if (this.log) {
                console.log(startTime);
                console.log('Analise de Projeto');
            }
            console.log('criando');
            this.criaPromises(pathsProject, startTime, status).finally(() => {
                resolve();
            });
            console.log('esperando');
        });
    }
    criaPromises(pathsProject, startTime, status = new projectStatus_1.ProjectStatus()) {
        return new Promise((resolve) => {
            let promisses = [];
            // monta expressão para buscar arquivos
            let globexp = [];
            for (var i = 0; i < this.advplExtensions.length; i++) {
                globexp.push(`**/*.${this.advplExtensions[i]}`);
            }
            console.log('procurando arquivos nas pastas(' + PrintTempo(startTime) + ')');
            let promissesGlobby = [];
            for (var i = 0; i < pathsProject.length; i++) {
                let pathProject = pathsProject[i];
                // busca arquivos na pasta
                // let files: string[] = await
                promissesGlobby.push(globby.default(globexp, {
                    cwd: pathProject,
                    caseSensitiveMatch: false,
                }));
            }
            Promise.all(promissesGlobby).then((folder) => {
                console.log('começando a validação(' + PrintTempo(startTime) + ')');
                // monta fila
                let fila = new fila_1.Fila();
                for (var x = 0; x < folder.length; x++) {
                    let files = folder[x];
                    status._total = files.length;
                    let cache = new cache_1.Cache(pathsProject[x] + this.version);
                    for (var j = 0; j < files.length; j++) {
                        let fileName = files[j];
                        let valida = new validaAdvpl_1.ValidaAdvpl(this.comentFontPad, this.local, cache, this.log);
                        valida.ownerDb = this.ownerDb;
                        valida.empresas = this.empresas;
                        if (this.log) {
                            console.log('Arquivo: ' + fileName);
                        }
                        try {
                            let conteudo = fileSystem.readFileSync(pathsProject[x] + '\\' + fileName, 'latin1');
                            fila.list.push(new fila_1.ItensValidacao(pathsProject[x] + '\\' + fileName, pathsProject[x], conteudo, valida));
                        }
                        catch (error) {
                            console.log(`Erro na abertura do arquivo ${fileName}!\n${error}`);
                        }
                    }
                }
                fila
                    .run()
                    .then((validacoes) => {
                    console.log('verificando duplicados (' + PrintTempo(startTime) + ')');
                    for (var idx = 0; idx < validacoes.length; idx++) {
                        let validacao = validacoes[idx];
                        let itemProjeto = new ItemProject_1.ItemModel();
                        itemProjeto.content = validacao.conteudoFonte;
                        itemProjeto.errors = validacao.aErros;
                        itemProjeto.fonte = validacao.fonte;
                        this.projeto.push(itemProjeto);
                    }
                    // verifica duplicados
                    this.verificaDuplicados().then(() => {
                        if (this.log && startTime) {
                            console.log('Terminou! (' + PrintTempo(startTime) + ' segundos)');
                            resolve();
                        }
                    });
                })
                    .catch((e) => {
                    console.log(e);
                });
            });
        });
    }
    verificaDuplicados() {
        return new Promise((resolve) => {
            let startTime = new Date();
            console.log('Start Duplicados');
            let listaFuncoes = [];
            let funcoesDuplicadas = [];
            let listaArquivos = [];
            let arquivosDuplicados = [];
            for (var idx = 0; idx < this.projeto.length; idx++) {
                let item = this.projeto[idx];
                let fonte = item.fonte;
                //verifica se o fonte ainda existe
                try {
                    fileSystem.statSync(fonte.fonte);
                    for (var idx2 = 0; idx2 < fonte.funcoes.length; idx2++) {
                        let funcao = fonte.funcoes[idx2];
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
                    }
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
            }
            // guarda lista de duplicados
            let duplicadosOld = JSON.parse(JSON.stringify(this.listaDuplicados));
            this.listaDuplicados.files = JSON.parse(JSON.stringify(arquivosDuplicados));
            this.listaDuplicados.functions = JSON.parse(JSON.stringify(funcoesDuplicadas));
            //Procura o que mudou
            let filesIncluidos = this.listaDuplicados.files.filter((x) => duplicadosOld.files.indexOf(x) === -1);
            let filesExcluidos = duplicadosOld.files.filter((x) => this.listaDuplicados.files.indexOf(x) === -1);
            let functionsIncluidos = this.listaDuplicados.functions.filter((x) => duplicadosOld.functions.indexOf(x) === -1);
            let functionsExcluidos = duplicadosOld.functions.filter((x) => this.listaDuplicados.functions.indexOf(x) === -1);
            // marca duplicados
            for (var idx = 0; idx < this.projeto.length; idx++) {
                let item = this.projeto[idx];
                let fonte = item.fonte;
                for (var idx2 = 0; idx2 < fonte.funcoes.length; idx2++) {
                    let funcao = fonte.funcoes[idx2];
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
                }
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
            }
            if (this.log) {
                let errosContagem = this.contaErros();
                console.log(`\t${errosContagem.errors} Errors`);
                console.log(`\t${errosContagem.warnings} Warnings`);
                console.log(`\t${errosContagem.information} Informations`);
                console.log(`\t${errosContagem.hint} Hints`);
            }
            if (this.log) {
                // calcula tempo gasto
                let endTime = new Date();
                let timeDiff = endTime - startTime; //in ms
                // strip the ms
                timeDiff /= 1000;
                // get seconds
                let seconds = Math.round(timeDiff);
                console.log('Terminou! (' + seconds + ' segundos) Duplicados');
            }
            resolve();
        });
    }
    contaErros() {
        let erros = { errors: 0, warnings: 0, information: 0, hint: 0 };
        for (var idx = 0; idx < this.projeto.length; idx++) {
            let item = this.projeto[idx];
            for (var idx2 = 0; idx2 < item.errors.length; idx2++) {
                let erro = item.errors[idx2];
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
            }
        }
        return erros;
    }
}
exports.ValidaProjeto = ValidaProjeto;
function traduz(key, local) {
    let locales = ['en', 'pt-br'];
    let i18n = require('i18n');
    i18n.configure({
        locales: locales,
        directory: __dirname + '/locales',
    });
    i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
    return i18n.__(key);
}
//# sourceMappingURL=validaProjeto.js.map