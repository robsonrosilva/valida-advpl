import { Include } from './include';
import { Erro, Severity } from './models/Erro';
import { Fonte, Tipos } from './fonte';
import { version } from './../package.json';
import { FileCache } from './models/FileCache';
import { Cache } from './cache';
import { FuncoesRestritasDesontinuadas } from './models/Restritos';

export class ValidaAdvpl {
  public comentFontPad: string[];
  public error: number;
  public warning: number;
  public information: number;
  public hint: number;
  public includes: any[];
  public aErros: Erro[];
  public ownerDb: string[];
  public empresas: string[];
  public fonte: Fonte;
  public version: string;
  public conteudoFonte: string;
  private local;
  cache: Cache;

  constructor(
    comentFontePad: string[],
    local: string,
    cache: Cache,
    private log: boolean = true
  ) {
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
    this.version = version;
    this.cache = cache;
  }

  public validacao(texto: string, path: string): Promise<ValidaAdvpl> {
    return new Promise((resolve: Function, reject: Function) => {
      try {
        let objeto: ValidaAdvpl = this;
        if (false && this.cache) {
          // Desabilitar o cache
          const file = this.cache.filesInCache.find((_file: FileCache) => {
            return _file.file === path && _file.content === texto;
          });
          if (file) {
            console.log('usando cache do ' + path + '!');
            objeto = file.validaAdvpl;
            if (
              objeto.error + objeto.hint + objeto.warning + objeto.information >
                0 &&
              this.log
            ) {
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
            return;
          }
        }

        // pepara objeto para o cache
        let fileForCache: FileCache = new FileCache();
        fileForCache.file = path;
        fileForCache.content = texto;

        objeto.conteudoFonte = texto;
        objeto.aErros = [];
        objeto.includes = [];
        objeto.fonte = new Fonte(path);
        let conteudoSComentario: string = '';
        let linhas: String[] = texto.split('\n');
        //Pega as linhas do documento ativo e separa o array por linha

        let restrictedFunctions = FuncoesRestritasDesontinuadas();
        let comentFuncoes: any[] = new Array();
        let funcoes: any[] = new Array();
        let cBeginSql: boolean = false;
        let FromQuery: boolean = false;
        let JoinQuery: boolean = false;
        let cSelect: boolean = false;
        let ProtheusDoc: boolean = false;
        let emComentario: boolean = false;
        //Percorre todas as linhas
        for (var key in linhas) {
          //seta linha atual em caixa alta
          let linha: String = linhas[key].toLocaleUpperCase();
          let linhaClean: String = '';
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
              key,
            ]);
          }

          //verifica se a linha está toda comentada
          let posComentLinha: number = linha.search(/\/\//);
          let posComentBloco: number = linha.search(/\/\*/);
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
            if (
              linha
                .replace(/\"+.+\"/, '')
                .replace(/\'+.+\'/, '')
                .match(/\/\*/)
            ) {
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
            while (linhaClean.match(/\"+.+\"/) || linhaClean.match(/\'+.+\'/)) {
              let colunaDupla: number = linhaClean.search(/\"+.+\"/);
              let colunaSimples: number = linhaClean.search(/\'+.+\'/);
              //se a primeira for a dupla
              if (
                colunaDupla !== -1 &&
                (colunaDupla < colunaSimples || colunaSimples === -1)
              ) {
                let quebra: string[] = linhaClean.split('"');
                linhaClean = linhaClean.replace('"' + quebra[1] + '"', '');
              } else {
                let quebra: string[] = linhaClean.split("'");
                linhaClean = linhaClean.replace("'" + quebra[1] + "'", '');
              }
            }

            //Remove espaços ou tabulações seguidas
            linhaClean = linhaClean.replace(/\t/g, ' ');
            linhaClean = linhaClean.replace(/\:\=/g, ' :=');
            linhaClean = linhaClean.replace(/\r/g, '');
            let conteudos: string[] = linhaClean.split(' ');
            linhaClean = '';
            for (const key in conteudos) {
              if (conteudos[key]) {
                linhaClean += conteudos[key] + ' ';
              }
            }

            conteudoSComentario = conteudoSComentario + linhaClean + '\n';
            let firstWord: string = linhaClean.split(' ')[0].split('\t')[0];

            // só analisa se tiver conteúdo
            if (conteudoSComentario.trim()) {
              // verifica se tem alguma chamada das funções restritas
              restrictedFunctions.forEach((functionRestricted) => {
                if (linhaClean.indexOf(functionRestricted.name + '(') > -1) {
                  objeto.aErros.push(
                    new Erro(
                      parseInt(key),
                      parseInt(key),
                      functionRestricted.deprecated
                        ? traduz('validaAdvpl.deprecated', objeto.local) +
                          (functionRestricted.newFunction
                            ? traduz('validaAdvpl.newfunction', objeto.local) +
                              functionRestricted.newFunction +
                              '!'
                            : '')
                        : traduz('validaAdvpl.restrictUse', objeto.local),
                      functionRestricted.type
                    )
                  );
                }
              });
              //verifica se é função e adiciona no array
              if (
                linhaClean.match(
                  /^(\s*)((user|static)(\s)*)?(function)(\s+)(\w+)/i
                )
              ) {
                //reseta todas as ariáveis de controle pois está fora de qualquer função
                cBeginSql = false;
                FromQuery = false;
                JoinQuery = false;
                cSelect = false;
                let nomeFuncao: string = linhaClean
                  .replace(/^(\s*)((user|static)(\s)*)?(function)(\s)+/gi, '')
                  .split('(')[0];
                //verifica se é um função e adiciona no array
                funcoes.push([nomeFuncao.trim(), key]);
                //verifica o TIPO
                if (
                  linhaClean.match(/^(\s*)((user)(\s)*)?(function)(\s+)(\w+)/i)
                ) {
                  objeto.fonte.addFunction(
                    Tipos['User Function'],
                    nomeFuncao,
                    parseInt(key)
                  );
                } else if (
                  linhaClean.match(
                    /^(\s*)((static)(\s)*)?(function)(\s+)(\w+)/i
                  )
                ) {
                  //verifica se a primeira palavra é FUNCTION
                  objeto.fonte.addFunction(
                    Tipos['Static Function'],
                    nomeFuncao,
                    parseInt(key)
                  );
                } else if (firstWord === 'FUNCTION') {
                  //verifica se a primeira palavra é FUNCTION
                  objeto.fonte.addFunction(
                    Tipos.Function,
                    nomeFuncao,
                    parseInt(key)
                  );
                }
              }
              //Verifica se é CLASSE ou WEBSERVICE
              if (
                linhaClean.match('METHOD\\ .*?CLASS') ||
                firstWord === 'CLASS' ||
                linhaClean.match('WSMETHOD.*?WSSERVICE') ||
                firstWord === 'WSSERVICE' ||
                firstWord === 'WSRESTFUL' ||
                firstWord === 'WSSTRUCT'
              ) {
                //reseta todas as ariáveis de controle pois está fora de qualquer função
                cBeginSql = false;
                FromQuery = false;
                JoinQuery = false;
                cSelect = false;
                //verifica se é um função e adiciona no array
                try {
                  funcoes.push([
                    linhaClean.trim().split(' ')[1].split('(')[0],
                    key,
                  ]);
                } catch {
                  console.log('Erro na captura de função da linha ');
                  console.log(linhaClean);
                }

                if (firstWord === 'CLASS') {
                  objeto.fonte.addFunction(
                    Tipos.Class,
                    linhaClean.trim().split(' ')[1].split('(')[0],
                    parseInt(key)
                  );
                }
                if (firstWord.match(/METHOD/)) {
                  let palavras: string[] = linhaClean.split(/,| |\t|\(/);
                  let metodo: string = palavras[1];
                  let classe: string;
                  for (var i = 0; i < palavras.length; i++) {
                    let key2 = palavras[i];
                    if (key2 === 'WSSERVICE' || key2 === 'CLASS') {
                      classe = palavras[i + 1];
                      break;
                    }
                  }

                  objeto.fonte.addFunction(
                    Tipos.Method,
                    classe + '|' + metodo,
                    parseInt(key)
                  );
                }
              }
              //Adiciona no objeto as variáveis locais
              if (firstWord === 'LOCAL') {
                //remove o LOCAL
                let variaveis: string[] = linhaClean.split(/,| |\t|\r/);
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
              if (linha.match(/^(\s*)#INCLUDE/i)) {
                //REMOVE as aspas a palavra #include e os espacos e tabulações
                objeto.includes.push({
                  include: linha
                    .replace(/^(\s*)#INCLUDE/gi, '')
                    .replace(/\t/g, '')
                    .replace(/\'/g, '')
                    .replace(/\"/g, '')
                    .trim(),
                  linha: parseInt(key),
                });
              }
              if (linhaClean.match(/^(\s*)BEGIN(\s*)ALIAS/)) {
                cBeginSql = true;
              }
              if (linha.match(/(\s|\'|\"|)+(SELECT|DELETE|UPDATE)(\s)+/)) {
                cSelect = true;
              }
              if (
                !cBeginSql &&
                ((linha.match(
                  /(\s|\'|\"|)+DBUSEAREA+(\s)*\(+.+TOPCONN+.+TCGENQRY/
                ) &&
                  !linha
                    .replace(
                      /(\s|\'|\"|)DBUSEAREA(\s)*\(.*,(\s|\'|\")*(.*)(\s|\'|\")/,
                      '$4'
                    )
                    .match(/TOPCONN/)) ||
                  linhaClean.match(/TCQUERY+(\s)/))
              ) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.queryNoEmbedded', objeto.local),
                    Severity.Warning
                  )
                );
                FromQuery = false;
                cSelect = false;
              }
              if (linha.match(/(\s|\'|\")+DELETE+(\s)+FROM+(\s)/)) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.deleteFrom', objeto.local),
                    Severity.Warning
                  )
                );
              }
              if (linhaClean.match(/MSGBOX\(/)) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.msgBox', objeto.local),
                    Severity.Information
                  )
                );
              }
              if (linha.match(/GETMV(\s|\()+(\"|\')+MV_FOLMES+(\"|\')/gi)) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.folMes', objeto.local),
                    Severity.Information
                  )
                );
              }
              if (linha.match('\\<\\<\\<\\<\\<\\<\\<\\ HEAD')) {
                //Verifica linha onde terminou o conflito
                let nFim: string = key;
                for (var key2 in linhas) {
                  if (
                    linhas[key2].match('\\>\\>\\>\\>\\>\\>\\>') &&
                    nFim === key &&
                    key2 > key
                  ) {
                    nFim = key2;
                  }
                }
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(nFim),
                    traduz('validaAdvpl.conflictMerge', objeto.local),
                    Severity.Error
                  )
                );
              }
              if (
                linha.match(/(\s|\'|\"|)+SELECT+(\s)/) &&
                linha.match('\\ \\*\\ ')
              ) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.selectAll', objeto.local),
                    Severity.Warning
                  )
                );
              }
              if (linha.match('CHR\\(13\\)') && linha.match('CHR\\(10\\)')) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.crlf', objeto.local),
                    Severity.Warning
                  )
                );
              }
              if (cSelect && linha.match('FROM')) {
                FromQuery = true;
              }
              if (cSelect && FromQuery && linha.match('JOIN')) {
                JoinQuery = true;
              }
              if (
                linha.match('ENDSQL') ||
                linha.match('WHERE') ||
                linha.match('TCQUERY')
              ) {
                FromQuery = false;
                cSelect = false;
              }
              //Implementação para aceitar vários bancos de dados
              for (var idb = 0; idb < objeto.ownerDb.length; idb++) {
                let banco: string = objeto.ownerDb[idb];
                if (cSelect && FromQuery && linha.match(banco)) {
                  objeto.aErros.push(
                    new Erro(
                      parseInt(key),
                      parseInt(key),
                      traduz('validaAdvpl.noSchema', objeto.local) +
                        banco +
                        traduz('validaAdvpl.inQuery', objeto.local),
                      Severity.Error
                    )
                  );
                }
              }
              if (cSelect && (FromQuery || JoinQuery || linha.match('SET'))) {
                //procura códigos de empresas nas queryes
                for (var idb = 0; idb < objeto.empresas.length; idb++) {
                  let reg = new RegExp(
                    '\\s([A-Za-z0-9]){3}' +
                      objeto.empresas[idb] +
                      '([A-Za-z0-9]){1}(\\s|$)',
                    'gmi'
                  );
                  if (reg.test(linha.toString())) {
                    objeto.aErros.push(
                      new Erro(
                        parseInt(key),
                        parseInt(key),
                        traduz('validaAdvpl.tableFixed', objeto.local),
                        Severity.Error
                      )
                    );
                  }
                }
              }
              if (cSelect && JoinQuery && linha.match('ON')) {
                JoinQuery = false;
              }
              if (linhaClean.match(/CONOUT(\s)*\(/)) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.conout', objeto.local),
                    Severity.Warning
                  )
                );
              }
              //  PUTSX1
              if (linhaClean.match(/PUTSX1(\s)*\(/)) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.PutSX1', objeto.local),
                    Severity.Error
                  )
                );
              }
              //  FreeObj(self) validação 12.1.27 10/2020
              if (linhaClean.match(/FREEOBJ(\s)*\((\s)*SELF(\s)*/)) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.freeObjSelf', objeto.local),
                    Severity.Error
                  )
                );
              }
              // Uso de Dicionários Fora do BeginSql
              let posicaoDic: number = (' ' + linhaClean).search(
                /(,| |\t|\>|\()+X+(1|2|3|5|6|7|9|A|B|D|G)+\_/gim
              );
              if (
                !cBeginSql &&
                posicaoDic !== -1 &&
                (' ' + linhaClean)
                  .substring(posicaoDic + 1)
                  .split(' ')[0]
                  .split('\t')[0]
                  .match(/\(/)
              ) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.Dictionary', objeto.local),
                    Severity.Error
                  )
                );
              }
              if (
                linhaClean.match(
                  /(,| |\t||\()*(MSFILE|MSFILE|DBCREATE|CRIATRAB)+( \(|\t\(|\()+/gim
                ) ||
                linhaClean.match(
                  /( |)*(MSCOPYFILE|MSERASE|COPY TO)+( |\t)+/gim
                ) ||
                (linhaClean.match(
                  /(,| |\t||\()*(DBUSEAREA)+( \(|\t\(|\()+/gim
                ) &&
                  !linha.match(/TOPCONN/))
              ) {
                objeto.aErros.push(
                  new Erro(
                    parseInt(key),
                    parseInt(key),
                    traduz('validaAdvpl.Isam', objeto.local),
                    Severity.Error
                  )
                );
              }
              //recomendação para melhorar identificação de problemas em queryes
              if (
                (linha.match(/(\s|)+SELECT+(\s)/) ||
                  linha.match(/(\s|)+DELETE+(\s)/) ||
                  linha.match(/(\s|)+UPDATE+(\s)/) ||
                  linha.match(/(\s|)+JOIN+(\s)/)) &&
                (linha.match(/(\s|)+FROM+(\s)/) ||
                  linha.match(/(\s|)+ON+(\s)/) ||
                  linha.match(/(\s|)+WHERE+(\s)/)) &&
                linha.match(/(\s)+TCSQLEXEC+\(/)
              ) {
                //verifica o caracter anterior tem que ser ou ESPACO ou ' ou " ou nada
                let itens1: string[] = ['FROM', 'ON', 'WHERE'];
                let addErro: boolean = false;
                for (var idx3 = 0; idx3 < itens1.length; idx3++) {
                  let item: string = itens1[idx3];

                  addErro = addErro || linha.search("\\'" + item) !== -1;
                  addErro = addErro || linha.search('\\"' + item) !== -1;
                  addErro = addErro || linha.search('\\ ' + item) !== -1;
                }

                if (addErro) {
                  objeto.aErros.push(
                    new Erro(
                      parseInt(key),
                      parseInt(key),
                      traduz('validaAdvpl.bestAnalitc', objeto.local) +
                        ' SELECT, DELETE, UPDATE, JOIN, FROM, ON, WHERE.',
                      Severity.Information
                    )
                  );
                }
              }
            }
          } else {
            conteudoSComentario += '\n';
          }
        }

        //Validação de padrão de comentáris de fontes
        let comentariosFonte: boolean = true;
        for (var _i = 0; _i < objeto.comentFontPad.length; _i++) {
          let cExpressao: string = objeto.comentFontPad[_i] as string;
          let linha: string = linhas[_i] as string;
          comentariosFonte =
            comentariosFonte && linha.search(cExpressao) !== -1;
        }

        if (!comentariosFonte) {
          objeto.aErros.push(
            new Erro(
              0,
              0,
              traduz('validaAdvpl.padComment', objeto.local),
              Severity.Information
            )
          );
        }

        //Validação funções sem comentários
        for (var idx = 0; idx < funcoes.length; idx++) {
          let funcao: string = funcoes[idx];
          let achou: boolean = false;
          for (var idx4 = 0; idx4 < comentFuncoes.length; idx4++) {
            let comentario: string = comentFuncoes[idx4];
            achou = achou || comentario[0] === funcao[0];
          }

          if (!achou) {
            objeto.aErros.push(
              new Erro(
                parseInt(funcao[1]),
                parseInt(funcao[1]),
                traduz('validaAdvpl.functionNoCommented', objeto.local),
                Severity.Warning
              )
            );
          }
        }
        //Validação comentários sem funções
        for (var idx = 0; idx < comentFuncoes.length; idx++) {
          let comentario: string = comentFuncoes[idx];
          let achou: boolean = false;
          for (var idx4 = 0; idx4 < funcoes.length; idx4++) {
            let funcao: string = funcoes[idx4];
            achou = achou || comentario[0] === funcao[0];
          }

          if (!achou) {
            objeto.aErros.push(
              new Erro(
                parseInt(comentario[1]),
                parseInt(comentario[1]),
                traduz('validaAdvpl.CommentNoFunction', objeto.local),
                Severity.Warning
              )
            );
          }
        }

        //Validador de includes
        let oInclude: Include = new Include(objeto.local);
        oInclude.valida(objeto, conteudoSComentario);
        //Conta os erros por tipo e totaliza no objeto
        objeto.hint = 0;
        objeto.information = 0;
        objeto.warning = 0;
        objeto.error = 0;
        for (var idx = 0; idx < objeto.aErros.length; idx++) {
          let erro: any = objeto.aErros[idx];
          if (erro.severity === Severity.Hint) {
            objeto.hint++;
          }
          if (erro.severity === Severity.Information) {
            objeto.information++;
          }
          if (erro.severity === Severity.Warning) {
            objeto.warning++;
          }
          if (erro.severity === Severity.Error) {
            objeto.error++;
          }
        }
        if (
          objeto.error + objeto.hint + objeto.warning + objeto.information >
            0 &&
          this.log
        ) {
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

        // se tem cache guarda
        if (false && this.cache) {
          // Desabilitar o cache
          console.log('gravando cache!');
          fileForCache.validaAdvpl = objeto;
          this.cache.addFile(fileForCache);
        }

        resolve(objeto);
      } catch (e) {
        reject(e);
      }
    });
  }
}

function traduz(key, local) {
  let locales: string[] = ['en', 'pt-br'];
  let i18n = require('i18n');
  i18n.configure({
    locales: locales,
    directory: __dirname + '/locales',
  });
  i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
  return i18n.__(key);
}
