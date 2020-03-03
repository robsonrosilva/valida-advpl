"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const include_1 = require("./include");
const Erro_1 = require("./models/Erro");
const fonte_1 = require("./fonte");
const package_json_1 = require("./package.json");
class ValidaAdvpl {
    constructor(comentFontePad, local, log = true) {
        this.log = log;
        this.local = local;
        this.aErros = [];
        this.includes = [];
        this.error = 0;
        this.warning = 0;
        this.information = 0;
        this.hint = 0;
        //Se nÃ£o estÃ¡ preenchido seta com valor padrÃ£o
        this.comentFontPad = comentFontePad;
        this.ownerDb = [];
        this.empresas = [];
        this.version = package_json_1.version;
    }
    validacao(texto, path) {
        return new Promise((resolve, reject) => {
            try {
                let objeto = this;
                objeto.conteudoFonte = texto;
                objeto.aErros = [];
                objeto.includes = [];
                objeto.fonte = new fonte_1.Fonte(path);
                let conteudoSComentario = '';
                let linhas = texto.split('\n');
                //Pega as linhas do documento ativo e separa o array por linha
                let comentFuncoes = new Array();
                let funcoes = new Array();
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
                    let linhaClean = '';
                    //se estiver no PotheusDoc vê se está fechando
                    if (ProtheusDoc && linha.match(/(\*\/)/i)) {
                        ProtheusDoc = false;
                    }
                    //verifica se é protheusDoc
                    if (linha.match(/^(\s*)(\/\*\/(.*)?\{Protheus.doc\}(.*)?)/i)) {
                        ProtheusDoc = true;
                        //reseta todas as ariáveis de controle pois se entrou em ProtheusDoc está fora de qualquer função
                        cBeginSql = false;
                        FromQuery = false;
                        JoinQuery = false;
                        cSelect = false;
                        //verifica se é um comentário de função e adiciona no array
                        comentFuncoes.push([
                            linha
                                .trim()
                                .replace(/^(\s*)(\/\*\/(.*)?\{Protheus.doc\}( |\t)*)/i, '')
                                .trim()
                                .toLocaleUpperCase(),
                            key
                        ]);
                    }
                    //verifica se a linha está toda comentada
                    let posComentLinha = linha.search(/\/\//);
                    let posComentBloco = linha.search(/\/\*/);
                    posComentBloco = posComentBloco === -1 ? 999999 : posComentBloco;
                    posComentLinha = posComentLinha === -1 ? 999999 : posComentLinha;
                    if (!emComentario && posComentLinha < posComentBloco) {
                        linha = linha.split('//')[0];
                    }
                    //Verifica se está em comentário de bloco
                    //trata comentários dentro da linha
                    linha = linha.replace(/\/\*+.+\*\//, '');
                    if (linha.match(/(\*\/)/i) && emComentario) {
                        emComentario = false;
                        linha = linha.split('*/')[1];
                    }
                    //se não estiver dentro do Protheus DOC valida linha
                    if (!emComentario) {
                        if (linha
                            .replace(/\"+.+\"/, '')
                            .replace(/\'+.+\'/, '')
                            .search(/\/\*/) !== -1) {
                            emComentario = true;
                            linha = linha.split(/\/\*/)[0];
                        }
                        //Se não estiver em comentário verifica se o último caracter da linha é ;
                        if (!emComentario && linha.charAt(linha.length - 1) === ';') {
                            linhas[parseInt(key) + 1] =
                                linha + ' ' + linhas[parseInt(key) + 1];
                            linha = '';
                        }
                        //trata comentários em linha ou strings em aspas simples ou duplas
                        //não remove aspas quando for include
                        linha = linha.split('//')[0];
                        linhaClean = linha;
                        if (linha.match(/^(\s*)#INCLUDE/)) {
                            while (linhaClean.match(/\"+.+\"/) ||
                                linhaClean.match(/\'+.+\'/)) {
                                let colunaDupla = linhaClean.search(/\"+.+\"/);
                                let colunaSimples = linhaClean.search(/\'+.+\'/);
                                //se a primeira for a dupla
                                if (colunaDupla !== -1 &&
                                    (colunaDupla < colunaSimples || colunaSimples === -1)) {
                                    let quebra = linhaClean.split('"');
                                    linhaClean = linhaClean.replace('"' + quebra[1] + '"', '');
                                }
                                else {
                                    let quebra = linhaClean.split("'");
                                    linhaClean = linhaClean.replace("'" + quebra[1] + "'", '');
                                }
                            }
                        }
                        //Remove espaços ou tabulações seguidas
                        linhaClean = linhaClean.replace(/\t/g, ' ');
                        linhaClean = linhaClean.replace(/\:\=/g, ' :=');
                        linhaClean = linhaClean.replace(/\r/g, '');
                        let conteudos = linhaClean.split(' ');
                        linhaClean = '';
                        for (const key in conteudos) {
                            if (conteudos[key]) {
                                linhaClean += conteudos[key] + ' ';
                            }
                        }
                        conteudoSComentario = conteudoSComentario + linhaClean + '\n';
                        let firstWord = linhaClean.split(' ')[0].split('\t')[0];
                        // só analisa se tiver conteúdo
                        if (conteudoSComentario.trim()) {
                            //verifica se é função e adiciona no array
                            if (linhaClean.match(/^(\s*)((user|static)(\ |\t)*)?(function)(\s+)(\w+)/i)) {
                                //reseta todas as ariáveis de controle pois está fora de qualquer função
                                cBeginSql = false;
                                FromQuery = false;
                                JoinQuery = false;
                                cSelect = false;
                                let nomeFuncao = linhaClean
                                    .replace(/^(\s*)((user|static)(\ |\t)*)?(function)(\ |\t)+/gi, '')
                                    .split('(')[0];
                                //verifica se é um função e adiciona no array
                                funcoes.push([nomeFuncao.trim(), key]);
                                //verifica o TIPO
                                if (linhaClean.match(/^(\s*)((user)(\ |\t)*)?(function)(\s+)(\w+)/i)) {
                                    objeto.fonte.addFunction(fonte_1.Tipos['User Function'], nomeFuncao, parseInt(key));
                                }
                                else if (linhaClean.match(/^(\s*)((static)(\ |\t)*)?(function)(\s+)(\w+)/i)) {
                                    //verifica se a primeira palavra é FUNCTION
                                    objeto.fonte.addFunction(fonte_1.Tipos['Static Function'], nomeFuncao, parseInt(key));
                                }
                                else if (firstWord === 'FUNCTION') {
                                    //verifica se a primeira palavra é FUNCTION
                                    objeto.fonte.addFunction(fonte_1.Tipos.Function, nomeFuncao, parseInt(key));
                                }
                            }
                            //Verifica se é CLASSE ou WEBSERVICE
                            if (linhaClean.search('METHOD\\ .*?CLASS') !== -1 ||
                                firstWord === 'CLASS' ||
                                linhaClean.search('WSMETHOD.*?WSSERVICE') !== -1 ||
                                firstWord === 'WSSERVICE' ||
                                firstWord === 'WSRESTFUL' ||
                                firstWord === 'WSSTRUCT') {
                                //reseta todas as ariáveis de controle pois está fora de qualquer função
                                cBeginSql = false;
                                FromQuery = false;
                                JoinQuery = false;
                                cSelect = false;
                                //verifica se é um função e adiciona no array
                                try {
                                    funcoes.push([
                                        linhaClean
                                            .trim()
                                            .split(' ')[1]
                                            .split('(')[0],
                                        key
                                    ]);
                                }
                                catch (_a) {
                                    console.log('Erro na captura de função da linha ');
                                    console.log(linhaClean);
                                }
                                if (firstWord === 'CLASS') {
                                    objeto.fonte.addFunction(fonte_1.Tipos.Class, linhaClean
                                        .trim()
                                        .split(' ')[1]
                                        .split('(')[0], parseInt(key));
                                }
                                if (firstWord.match(/METHOD/)) {
                                    let palavras = linhaClean.split(/,| |\t|\(/);
                                    let metodo = palavras[1];
                                    let classe;
                                    for (var i = 0; i < palavras.length; i++) {
                                        let key2 = palavras[i];
                                        if (key2 === 'WSSERVICE' || key2 === 'CLASS') {
                                            classe = palavras[i + 1];
                                            break;
                                        }
                                    }
                                    objeto.fonte.addFunction(fonte_1.Tipos.Method, classe + '|' + metodo, parseInt(key));
                                }
                            }
                            //Adiciona no objeto as variáveis locais
                            if (firstWord === 'LOCAL') {
                                //remove o LOCAL
                                let variaveis = linhaClean.split(/,| |\t|\r/);
                                for (var key2 of variaveis) {
                                    if (key2 !== 'LOCAL' && key2 !== '') {
                                        // se terminar as variáveis
                                        if (key2.match(/\:\=/)) {
                                            break;
                                        }
                                        //objeto.fonte.addVariavel(key2);
                                    }
                                }
                            }
                            //Verifica se adicionou o include TOTVS.CH
                            if (linha.search(/^(\s*)#INCLUDE/i) !== -1) {
                                //REMOVE as aspas a palavra #include e os espacos e tabulações
                                objeto.includes.push({
                                    include: linha
                                        .replace(/^(\s*)#INCLUDE/gi, '')
                                        .replace(/\t/g, '')
                                        .replace(/\'/g, '')
                                        .replace(/\"/g, '')
                                        .trim(),
                                    linha: parseInt(key)
                                });
                            }
                            if (linhaClean.search(/^(\s*)BEGIN(\s*)ALIAS/) !== -1) {
                                cBeginSql = true;
                            }
                            if (linha.match(/(\ |\t|\'|\"|)+(SELECT|DELETE|UPDATE)(\ |\t)+/)) {
                                cSelect = true;
                            }
                            if (!cBeginSql &&
                                (linha.search(/(\ |\t|\'|\"|)+DBUSEAREA+(\ |\t|)+\(+.+TOPCONN+.+TCGENQRY/) !== -1 ||
                                    linhaClean.search(/TCQUERY+(\ |\t)/) !== -1)) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.queryNoEmbedded', objeto.local), Erro_1.Severity.Warning));
                                FromQuery = false;
                                cSelect = false;
                            }
                            if (linha.search(/(\ |\t|\'|\")+DELETE+(\ |\t)+FROM+(\ |\t)/) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.deleteFrom', objeto.local), Erro_1.Severity.Warning));
                            }
                            if (linhaClean.search(/MSGBOX\(/) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.msgBox', objeto.local), Erro_1.Severity.Information));
                            }
                            if (linha.match(/GETMV(\ |\t|\()+(\"|\')+MV_FOLMES+(\"|\')/gi)) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.folMes', objeto.local), Erro_1.Severity.Information));
                            }
                            if (linha.search('\\<\\<\\<\\<\\<\\<\\<\\ HEAD') !== -1) {
                                //Verifica linha onde terminou o conflito
                                let nFim = key;
                                for (var key2 in linhas) {
                                    if (linhas[key2].search('\\>\\>\\>\\>\\>\\>\\>') !== -1 &&
                                        nFim === key &&
                                        key2 > key) {
                                        nFim = key2;
                                    }
                                }
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(nFim), traduz('validaAdvpl.conflictMerge', objeto.local), Erro_1.Severity.Error));
                            }
                            if (linha.search(/(\ |\t|\'|\"|)+SELECT+(\ |\t)/) !== -1 &&
                                linha.search('\\ \\*\\ ') !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.selectAll', objeto.local), Erro_1.Severity.Warning));
                            }
                            if (linha.search('CHR\\(13\\)') !== -1 &&
                                linha.search('CHR\\(10\\)') !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.crlf', objeto.local), Erro_1.Severity.Warning));
                            }
                            if (cSelect && linha.search('FROM') !== -1) {
                                FromQuery = true;
                            }
                            if (cSelect && FromQuery && linha.search('JOIN') !== -1) {
                                JoinQuery = true;
                            }
                            if (linha.search('ENDSQL') !== -1 ||
                                linha.search('WHERE') !== -1 ||
                                linha.search('TCQUERY') !== -1) {
                                FromQuery = false;
                                cSelect = false;
                            }
                            //Implementação para aceitar vários bancos de dados
                            for (var idb = 0; idb < objeto.ownerDb.length; idb++) {
                                let banco = objeto.ownerDb[idb];
                                if (cSelect && FromQuery && linha.search(banco) !== -1) {
                                    objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.noSchema', objeto.local) +
                                        banco +
                                        traduz('validaAdvpl.inQuery', objeto.local), Erro_1.Severity.Error));
                                }
                            }
                            if (cSelect &&
                                (FromQuery || JoinQuery || linha.search('SET') !== -1) &&
                                linha.search('exp:cTable') === -1) {
                                //procura códigos de empresas nas queryes
                                for (var idb = 0; idb < objeto.empresas.length; idb++) {
                                    let empresa = objeto.empresas[idb];
                                    //para melhorar a análise vou quebrar a string por espaços
                                    //e removendo as quebras de linhas, vou varrer os itens do array e verificar o tamanho
                                    //e o código da empresa chumbado
                                    let palavras = linha
                                        .replace(/\r/g, '')
                                        .replace(/\t/g, '')
                                        .split(' ');
                                    for (var idb2 = 0; idb2 < palavras.length; idb2++) {
                                        let palavra = palavras[idb2];
                                        if (palavra.search(empresa + '0') !== -1 &&
                                            palavra.length === 6) {
                                            objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.tableFixed', objeto.local), Erro_1.Severity.Error));
                                        }
                                    }
                                }
                            }
                            if (cSelect && JoinQuery && linha.search('ON') !== -1) {
                                JoinQuery = false;
                            }
                            if (linhaClean.search(/CONOUT(\ |\t)*\(/) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.conout', objeto.local), Erro_1.Severity.Warning));
                            }
                            //  PUTSX1
                            if (linhaClean.search(/PUTSX1(\ |\t)*\(/) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.PutSX1', objeto.local), Erro_1.Severity.Error));
                            }
                            // Uso de Dicionários Fora do BeginSql
                            let posicaoDic = (' ' + linhaClean).search(/(,| |\t|\>|\()+X+(1|2|3|5|6|7|9|A|B|D|G)+\_/gim);
                            if (!cBeginSql &&
                                posicaoDic !== -1 &&
                                (' ' + linhaClean)
                                    .substring(posicaoDic + 1)
                                    .split(' ')[0]
                                    .split('\t')[0]
                                    .search(/\(/) === -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.Dictionary', objeto.local), Erro_1.Severity.Error));
                            }
                            if (linhaClean.search(/(,| |\t||\()*(MSFILE|MSFILE|DBCREATE|DBUSEAREA|CRIATRAB)+( \(|\t\(|\()+/gim) !== -1 ||
                                linhaClean.search(/( |)*(MSCOPYFILE|MSERASE|COPY TO)+( |\t)+/gim) !== -1) {
                                objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.Isam', objeto.local), Erro_1.Severity.Error));
                            }
                            //recomendação para melhorar identificação de problemas em queryes
                            if ((linha.match(/(\ |\t|)+SELECT+(\ |\t)/) ||
                                linha.match(/(\ |\t|)+DELETE+(\ |\t)/) ||
                                linha.match(/(\ |\t|)+UPDATE+(\ |\t)/) ||
                                linha.match(/(\ |\t|)+JOIN+(\ |\t)/)) &&
                                (linha.match(/(\ |\t|)+FROM+(\ |\t)/) ||
                                    linha.match(/(\ |\t|)+ON+(\ |\t)/) ||
                                    linha.match(/(\ |\t|)+WHERE+(\ |\t)/)) &&
                                linha.search(/(\ |\t)+TCSQLEXEC+\(/) === -1) {
                                //verifica o caracter anterior tem que ser ou ESPACO ou ' ou " ou nada
                                let itens1 = ['FROM', 'ON', 'WHERE'];
                                let addErro = false;
                                for (var idx3 = 0; idx3 < itens1.length; idx3++) {
                                    let item = itens1[idx3];
                                    addErro = addErro || linha.search("\\'" + item) !== -1;
                                    addErro = addErro || linha.search('\\"' + item) !== -1;
                                    addErro = addErro || linha.search('\\ ' + item) !== -1;
                                }
                                if (addErro) {
                                    objeto.aErros.push(new Erro_1.Erro(parseInt(key), parseInt(key), traduz('validaAdvpl.bestAnalitc', objeto.local) +
                                        ' SELECT, DELETE, UPDATE, JOIN, FROM, ON, WHERE.', Erro_1.Severity.Information));
                                }
                            }
                        }
                    }
                    else {
                        conteudoSComentario += '\n';
                    }
                }
                //Validação de padrão de comentáris de fontes
                let comentariosFonte = true;
                for (var _i = 0; _i < objeto.comentFontPad.length; _i++) {
                    let cExpressao = objeto.comentFontPad[_i];
                    let linha = linhas[_i];
                    comentariosFonte =
                        comentariosFonte && linha.search(cExpressao) !== -1;
                }
                if (!comentariosFonte) {
                    objeto.aErros.push(new Erro_1.Erro(0, 0, traduz('validaAdvpl.padComment', objeto.local), Erro_1.Severity.Information));
                }
                //Validação funções sem comentários
                for (var idx = 0; idx < funcoes.length; idx++) {
                    let funcao = funcoes[idx];
                    let achou = false;
                    for (var idx4 = 0; idx4 < comentFuncoes.length; idx4++) {
                        let comentario = comentFuncoes[idx4];
                        achou = achou || comentario[0] === funcao[0];
                    }
                    if (!achou) {
                        objeto.aErros.push(new Erro_1.Erro(parseInt(funcao[1]), parseInt(funcao[1]), traduz('validaAdvpl.functionNoCommented', objeto.local), Erro_1.Severity.Warning));
                    }
                }
                //Validação comentários sem funções
                for (var idx = 0; idx < comentFuncoes.length; idx++) {
                    let comentario = comentFuncoes[idx];
                    let achou = false;
                    for (var idx4 = 0; idx4 < funcoes.length; idx4++) {
                        let funcao = funcoes[idx4];
                        achou = achou || comentario[0] === funcao[0];
                    }
                    if (!achou) {
                        objeto.aErros.push(new Erro_1.Erro(parseInt(comentario[1]), parseInt(comentario[1]), traduz('validaAdvpl.CommentNoFunction', objeto.local), Erro_1.Severity.Warning));
                    }
                }
                //Validador de includes
                let oInclude = new include_1.Include(objeto.local);
                oInclude.valida(objeto, conteudoSComentario);
                //Conta os erros por tipo e totaliza no objeto
                objeto.hint = 0;
                objeto.information = 0;
                objeto.warning = 0;
                objeto.error = 0;
                for (var idx = 0; idx < objeto.aErros.length; idx++) {
                    let erro = objeto.aErros[idx];
                    if (erro.severity === Erro_1.Severity.Hint) {
                        objeto.hint++;
                    }
                    if (erro.severity === Erro_1.Severity.Information) {
                        objeto.information++;
                    }
                    if (erro.severity === Erro_1.Severity.Warning) {
                        objeto.warning++;
                    }
                    if (erro.severity === Erro_1.Severity.Error) {
                        objeto.error++;
                    }
                }
                if (objeto.error + objeto.hint + objeto.warning + objeto.information >
                    0 &&
                    this.log) {
                    if (objeto.error > 0) {
                        console.log(`\t\t${objeto.error} Errors .`);
                    }
                    if (objeto.warning > 0) {
                        console.log(`\t\t${objeto.warning} Warnings .`);
                    }
                    if (objeto.information > 0) {
                        console.log(`\t\t${objeto.information} Informations .`);
                    }
                    if (objeto.hint > 0) {
                        console.log(`\t\t${objeto.hint} Hints .`);
                    }
                }
                resolve(objeto);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.ValidaAdvpl = ValidaAdvpl;
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
//# sourceMappingURL=validaAdvpl.js.map