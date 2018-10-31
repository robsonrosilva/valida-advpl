"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fileSystem = require("fs");
const Include_1 = require("./Include");
const Fonte_1 = require("./Fonte");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
//Cria um colection para os erros ADVPL
const collection = vscode.languages.createDiagnosticCollection('advpl');
function vscodeFindFilesSync() {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.workspace.findFiles('**/*.*', '**/*.json');
    });
}
class ValidaAdvpl {
    constructor() {
        this.comentFontPad = vscode.workspace.getConfiguration("advpl-sintaxe").get("comentFontPad");
        this.aErros = [];
        this.includes = [];
        this.fontes = [];
        this.error = 0;
        this.warning = 0;
        this.information = 0;
        this.hint = 0;
        this.versao = "";
        let extensao = vscode.extensions.getExtension("robsonrosilva.advpl-sintaxe");
        if (extensao) {
            this.versao = extensao.packageJSON.version;
        }
        //Se não está preenchido seta com valor padrão
        if (!this.comentFontPad) {
            this.comentFontPad = [];
            this.comentFontPad.push('\\/\\*\\/\\/' + '\\#'.repeat(89));
            this.comentFontPad.push('Projeto\\ \\:');
            this.comentFontPad.push('Modulo\\ \\ \\:');
            this.comentFontPad.push('Fonte\\ \\ \\ \\:');
            this.comentFontPad.push('Objetivo\\:');
            this.comentFontPad.push('\\*\\/\\/\\/' + '\\#'.repeat(89));
        }
    }
    validaProjeto(nGeradas = 0, tags = [], fileContent = '', branchAtual = '', objetoMerge) {
        return __awaiter(this, void 0, void 0, function* () {
            let tag = tags[nGeradas];
            let fileLog = vscode.workspace.rootPath + "/AnaliseProjeto.csv";
            this.fontes = [];
            this.error = 0;
            this.warning = 0;
            this.information = 0;
            this.hint = 0;
            //guarda objeto this
            let objeto = this;
            //percorre todos os fontes do Workspace e valida se for ADVPL
            let advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
            let files = yield vscodeFindFilesSync();
            files.forEach((file) => {
                let re = /(?:\.([^.]+))?$/;
                let extensao = re.exec(file.fsPath);
                if (extensao && advplExtensions.indexOf(extensao[1].toLowerCase()) !== -1) {
                    console.log("Validando  " + file.fsPath);
                    let conteudo = fileSystem.readFileSync(file.fsPath, "latin1");
                    if (conteudo) {
                        objeto.validacao(conteudo, file);
                    }
                }
                //Se for o último arquivo verifica se deve gravar no arquivo LOG
                if (!fileContent && file === files[files.length - 1]) {
                    vscode.window.showInformationMessage(localize(0, null));
                }
                else if (fileContent && file === files[files.length - 1]) {
                    fileContent = fileContent.replace(tag + "\t\t\t\t\n", objeto.padTag(tag, tags) + "\t" +
                        objeto.error + "\t" +
                        objeto.warning + "\t" +
                        objeto.information + "\t" +
                        objeto.hint + "\t" +
                        objeto.versao
                        + "\n");
                    fileSystem.writeFileSync(fileLog, fileContent);
                    console.log("Gerou TAG " + tag);
                    nGeradas++;
                    if (tags[nGeradas]) {
                        objetoMerge.geraRelatorio(nGeradas, tags, fileContent, branchAtual);
                    }
                }
            });
        });
    }
    validaFonte(editor) {
        //guarda objeto this
        let objeto = this;
        if (editor) {
            //verifica se a linguagem é ADVPL
            if (editor.document.languageId === "advpl") {
                objeto.validacao(editor.document.getText(), editor.document.uri);
            }
        }
    }
    padTag(tag, tags) {
        //Padroniza TAGS
        let nNivel1 = 0;
        let nNivel2 = 0;
        let nNivel3 = 0;
        tags.forEach((tagAtu) => {
            let aNiveis = tagAtu.split('.');
            nNivel1 = Math.max(aNiveis[0].length, nNivel1);
            nNivel2 = Math.max(aNiveis[1].length, nNivel2);
            nNivel3 = Math.max(aNiveis[2].length, nNivel3);
        });
        let aNiveis = tag.split('.');
        if (aNiveis[0].length < nNivel1) {
            let length = nNivel1 - aNiveis[0].toString().length + 1;
            aNiveis[0] = Array(length).join('0') + aNiveis[0];
        }
        if (aNiveis[1].length < nNivel2) {
            let length = nNivel2 - aNiveis[1].toString().length + 1;
            aNiveis[1] = Array(length).join('0') + aNiveis[1];
        }
        if (aNiveis[2].length < nNivel3) {
            let length = nNivel3 - aNiveis[2].toString().length + 1;
            aNiveis[2] = Array(length).join('0') + aNiveis[2];
        }
        return aNiveis[0] + "." + aNiveis[1] + "." + aNiveis[2];
    }
    validacao(texto, uri) {
        this.aErros = [];
        this.includes = [];
        let fonte = new Fonte_1.Fonte(uri.fsPath);
        //guarda objeto this
        let objeto = this;
        let conteudoSComentario = "";
        //Busca Configurações do Settings
        let ownerDb = vscode.workspace.getConfiguration("advpl-sintaxe").get("ownerDb");
        if (!ownerDb) {
            ownerDb = ['PROTHEUS'];
        }
        let empresas = vscode.workspace.getConfiguration("advpl-sintaxe").get("empresas");
        if (!empresas) {
            empresas = ['01', '02'];
        }
        let linhas = texto.split("\n");
        //Pega as linhas do documento ativo e separa o array por linha
        let comentFuncoes = new Array();
        let funcoes = new Array();
        let prepareEnvionment = new Array();
        let cBeginSql = false;
        let FromQuery = false;
        let JoinQuery = false;
        let cSelect = false;
        let ProtheusDoc = false;
        let emComentario = false;
        //Percorre todas as linhas
        for (var key in linhas) {
            //seta linha atual em caixa alta
            let linha = linhas[key].toLocaleUpperCase();
            let linhaClean = "";
            //se estiver no PotheusDoc vê se está fechando
            if (ProtheusDoc && linha.search("\\/\\*\\/") !== -1) {
                ProtheusDoc = false;
            }
            //verifica se é protheusDoc
            if (linha.search("\\/\\*\\/\\{PROTHEUS\\.DOC\\}") !== -1) {
                ProtheusDoc = true;
                //reseta todas as ariáveis de controle pois se entrou em ProtheusDoc está fora de qualquer função
                cBeginSql = false;
                FromQuery = false;
                JoinQuery = false;
                cSelect = false;
                //verifica se é um comentário de função e adiciona no array
                comentFuncoes.push([linha.trim().replace("/*/{PROTHEUS.DOC}", "").trim().toLocaleUpperCase(), key]);
            }
            //verifica se a linha está toda comentada
            let posComentLinha = linha.search(/\/\//);
            let posComentBloco = linha.search(/\/\*/);
            posComentBloco = (posComentBloco === -1 ? 999999 : posComentBloco);
            posComentLinha = (posComentLinha === -1 ? 999999 : posComentLinha);
            if (!emComentario && posComentLinha < posComentBloco) {
                linha = linha.split("//")[0];
            }
            //Verifica se está em comentário de bloco
            //trata comentários dentro da linha
            linha = linha.replace(/\/\*+.+\*\//, "");
            if (linha.search(/\*\//) !== -1 && emComentario) {
                emComentario = false;
                linha = linha.split(/\*\//)[1];
            }
            //se não estiver dentro do Protheus DOC valida linha
            if (!emComentario) {
                if (linha.replace(/\"+.+\"/, "").replace(/\'+.+\'/, "").search(/\/\*/) !== -1) {
                    emComentario = true;
                    linha = linha.split(/\/\*/)[0];
                }
                //Se não estiver em comentário verifica se o último caracter da linha é ;
                if (!emComentario && linha.charAt(linha.length - 1) === ";") {
                    linhas[parseInt(key) + 1] = linha + " " + linhas[parseInt(key) + 1];
                    linha = "";
                }
                //trata comentários em linha ou strings em aspas simples ou duplas
                //não remove aspas quando for include
                linha = linha.split("//")[0];
                linhaClean = linha;
                if (linha.search(/#INCLUDE/) === -1) {
                    while (linhaClean.search(/\"+.+\"/) !== -1 || linhaClean.search(/\'+.+\'/) !== -1) {
                        let colunaDupla = linhaClean.search(/\"+.+\"/);
                        let colunaSimples = linhaClean.search(/\'+.+\'/);
                        //se a primeira for a dupla
                        if (colunaDupla !== -1 && (colunaDupla < colunaSimples || colunaSimples === -1)) {
                            let quebra = linhaClean.split('\"');
                            linhaClean = linhaClean.replace('\"' + quebra[1] + '\"', "");
                        }
                        else {
                            let quebra = linhaClean.split("\'");
                            linhaClean = linhaClean.replace("\'" + quebra[1] + "\'", "");
                        }
                    }
                }
                conteudoSComentario = conteudoSComentario + linhaClean + "\n";
                //verifica se é função e adiciona no array
                if (linhaClean.search(/(STATIC|USER|)+(\ |\t)+FUNCTION+(\ |\t)/) !== -1 &&
                    linhaClean.trim().split("\ ")[0].match(/STATIC|USER|FUNCTION/)) {
                    //reseta todas as ariáveis de controle pois está fora de qualquer função
                    cBeginSql = false;
                    FromQuery = false;
                    JoinQuery = false;
                    cSelect = false;
                    let nomeFuncao = linhaClean.replace("\t", "\ ").trim().split(" ")[2].split("(")[0];
                    //verifica se é um função e adiciona no array
                    funcoes.push([nomeFuncao, key]);
                    //verifica o TIPO
                    if (linhaClean.search(/(USER)+(\ |\t)+FUNCTION+(\ |\t)/) !== -1) {
                        fonte.addFunction(Fonte_1.Tipos["User Function"], nomeFuncao, parseInt(key));
                    }
                    else if (linhaClean.split("\ ")[0].split("\t")[0] === "FUNCTION") {
                        //verifica se a primeira palavra é FUNCTION
                        fonte.addFunction(Fonte_1.Tipos["Function"], nomeFuncao, parseInt(key));
                    }
                }
                //Verifica se é CLASSE ou WEBSERVICE 
                if (linhaClean.search("METHOD\\ .*?CLASS") !== -1 ||
                    linhaClean.split("\ ")[0].split("\t")[0] === "CLASS" ||
                    linhaClean.search("WSMETHOD.*?WSSERVICE") !== -1 ||
                    linhaClean.search("WSSERVICE\\ ") !== -1) {
                    //reseta todas as ariáveis de controle pois está fora de qualquer função
                    cBeginSql = false;
                    FromQuery = false;
                    JoinQuery = false;
                    cSelect = false;
                    //verifica se é um função e adiciona no array
                    funcoes.push([linhaClean.trim().split(" ")[1].split("(")[0], key]);
                    if (linhaClean.split("\ ")[0].split("\t")[0] === "CLASS") {
                        fonte.addFunction(Fonte_1.Tipos["Class"], linhaClean.trim().split(" ")[1].split("(")[0], parseInt(key));
                    }
                }
                //Verifica se adicionou o include TOTVS.CH
                if (linha.search(/#INCLUDE/) !== -1) {
                    //REMOVE as aspas a palavra #include e os espacos e tabulações
                    objeto.includes.push({
                        include: linha.replace(/#INCLUDE/g, "").replace(/\t/g, "").replace(/\'/g, "").replace(/\"/g, "").trim(),
                        linha: parseInt(key)
                    });
                }
                if (linhaClean.search(/BEGINSQL+(\ |\t)+ALIAS/) !== -1) {
                    cBeginSql = true;
                }
                if (linhaClean.search(/PREPARE+(\ |\t)+ENVIRONMENT+(\ |\t)/) !== -1) {
                    prepareEnvionment.push(parseInt(key));
                }
                if (linha.match(/(\ |\t|\'|\"|)+SELECT+(\ |\t)/) ||
                    linha.match(/(\ |\t|\'|\"|)+DELETE+(\ |\t)/) ||
                    linha.match(/(\ |\t|\'|\"|)+UPDATE+(\ |\t)/)) {
                    cSelect = true;
                }
                if (!cBeginSql &&
                    (linha.search(/(\ |\t|\'|\"|)+DBUSEAREA+(\ |\t|)+\(+.+TOPCONN+.+TCGENQRY/) !== -1 ||
                        linhaClean.search(/TCQUERY+(\ |\t)/) !== -1)) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(1, null), vscode.DiagnosticSeverity.Warning));
                    FromQuery = false;
                    cSelect = false;
                }
                if (linha.search(/(\ |\t|\'|\")+DELETE+(\ |\t)+FROM+(\ |\t)/) !== -1) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(2, null), vscode.DiagnosticSeverity.Warning));
                }
                if (linhaClean.search(/MSGBOX\(/) !== -1) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(3, null), vscode.DiagnosticSeverity.Information));
                }
                if (linha.search(/GETMV\(+(\ |\t|)+(\"|\')+MV_FOLMES+(\"|\')+(\ |\t|)\)/) !== -1) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(4, null), vscode.DiagnosticSeverity.Information));
                }
                if (linha.search("\\<\\<\\<\\<\\<\\<\\<\\ HEAD") !== -1) {
                    //Verifica linha onde terminou o conflito
                    let nFim = key;
                    for (var key2 in linhas) {
                        if (linhas[key2].search("\\>\\>\\>\\>\\>\\>\\>") !== -1 && nFim === key && key2 > key) {
                            nFim = key2;
                        }
                    }
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(nFim), 0), localize(5, null), vscode.DiagnosticSeverity.Error));
                }
                if (linha.search(/(\ |\t|\'|\"|)+SELECT+(\ |\t)/) !== -1 && linha.search("\\ \\*\\ ") !== -1) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(6, null), vscode.DiagnosticSeverity.Warning));
                }
                if (linha.search("CHR\\(13\\)") !== -1 && linha.search("CHR\\(10\\)") !== -1) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(7, null), vscode.DiagnosticSeverity.Warning));
                }
                if (cSelect && linha.search("FROM") !== -1) {
                    FromQuery = true;
                }
                if (cSelect && FromQuery && linha.search("JOIN") !== -1) {
                    JoinQuery = true;
                }
                if (linha.search("ENDSQL") !== -1 ||
                    linha.search("WHERE") !== -1 ||
                    linha.search("TCQUERY") !== -1) {
                    FromQuery = false;
                    cSelect = false;
                }
                //Implementação para aceitar vários bancos de dados
                ownerDb.forEach(banco => {
                    if (cSelect && FromQuery && linha.search(banco) !== -1) {
                        objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(8, null)
                            + banco +
                            localize(9, null), vscode.DiagnosticSeverity.Error));
                    }
                });
                if (cSelect && (FromQuery || JoinQuery || linha.search("SET") !== -1) &&
                    linha.search("exp:cTable") === -1) {
                    //procura códigos de empresas nas queryes 
                    empresas.forEach(empresa => {
                        //para melhorar a análise vou quebrar a string por espaços 
                        //e removendo as quebras de linhas, vou varrer os itens do array e verificar o tamanho 
                        //e o código da empresa chumbado
                        let palavras = linha.replace(/\r/g, "").replace(/\t/g, "").split(" ");
                        palavras.forEach(palavra => {
                            if (palavra.search(empresa + "0") !== -1 && palavra.length === 6) {
                                objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(10, null), vscode.DiagnosticSeverity.Error));
                            }
                        });
                    });
                }
                if (cSelect && JoinQuery && linha.search("ON") !== -1) {
                    JoinQuery = false;
                }
                if (linhaClean.search(/CONOUT\(/) !== -1) {
                    objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(11, null), vscode.DiagnosticSeverity.Warning));
                }
                //recomendação para melhorar identificação de problemas em queryes
                if ((linha.match(/(\ |\t|)+SELECT+(\ |\t)/) ||
                    linha.match(/(\ |\t|)+DELETE+(\ |\t)/) ||
                    linha.match(/(\ |\t|)+UPDATE+(\ |\t)/) ||
                    linha.match(/(\ |\t|)+JOIN+(\ |\t)/)) && (linha.match(/(\ |\t|)+FROM+(\ |\t)/) ||
                    linha.match(/(\ |\t|)+ON+(\ |\t)/) ||
                    linha.match(/(\ |\t|)+WHERE+(\ |\t)/)) &&
                    linha.search(/(\ |\t)+TCSQLEXEC+\(/) === -1) {
                    //verifica o caracter anterior tem que ser ou ESPACO ou ' ou " ou nada
                    let itens1 = ["FROM", "ON", "WHERE"];
                    let addErro = false;
                    itens1.forEach(item => {
                        addErro = addErro || linha.search("\\'" + item) !== -1;
                        addErro = addErro || linha.search('\\"' + item) !== -1;
                        addErro = addErro || linha.search("\\ " + item) !== -1;
                    });
                    if (addErro) {
                        objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(key), 0, parseInt(key), 0), localize(12, null) +
                            ' SELECT, DELETE, UPDATE, JOIN, FROM, ON, WHERE.', vscode.DiagnosticSeverity.Information));
                    }
                }
            }
            else {
                conteudoSComentario += "\n";
            }
        }
        //Validação de padrão de comentáris de fontes
        let comentariosFonte = true;
        for (var _i = 0; _i < objeto.comentFontPad.length; _i++) {
            let cExpressao = objeto.comentFontPad[_i];
            let linha = linhas[_i];
            comentariosFonte = comentariosFonte && linha.search(cExpressao) !== -1;
        }
        if (!comentariosFonte) {
            objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0), localize(13, null), vscode.DiagnosticSeverity.Information));
        }
        //Validação funções sem comentários
        funcoes.forEach(funcao => {
            let achou = false;
            comentFuncoes.forEach(comentario => {
                achou = achou || comentario[0] === funcao[0];
            });
            if (!achou) {
                objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(funcao[1]), 0, parseInt(funcao[1]), 0), localize(14, null), vscode.DiagnosticSeverity.Warning));
            }
        });
        //Validação comentários sem funções
        comentFuncoes.forEach(comentario => {
            let achou = false;
            funcoes.forEach(funcao => {
                achou = achou || comentario[0] === funcao[0];
            });
            if (!achou) {
                objeto.aErros.push(new vscode.Diagnostic(new vscode.Range(parseInt(comentario[1]), 0, parseInt(comentario[1]), 0), localize(15, null), vscode.DiagnosticSeverity.Warning));
            }
        });
        //Validador de includes
        let oInclude = new Include_1.Include();
        oInclude.valida(objeto, conteudoSComentario);
        //Limpa as mensagens do colection
        collection.delete(uri);
        collection.set(uri, objeto.aErros);
        //Conta os erros por tipo e totaliza no objeto
        objeto.aErros.forEach((erro) => {
            if (erro.severity === vscode.DiagnosticSeverity.Hint) {
                this.hint++;
            }
            if (erro.severity === vscode.DiagnosticSeverity.Information) {
                this.information++;
            }
            if (erro.severity === vscode.DiagnosticSeverity.Warning) {
                this.warning++;
            }
            if (erro.severity === vscode.DiagnosticSeverity.Error) {
                this.error++;
            }
        });
        this.aErros = [];
        this.includes = [];
    }
}
exports.ValidaAdvpl = ValidaAdvpl;

//# sourceMappingURL=validaAdvpl.js.map
