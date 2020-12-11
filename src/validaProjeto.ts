import { Erro, Severity } from './models/Erro';
import { Duplicados } from './models/Duplicados';
import { Fonte, Funcao, Tipos } from './fonte';
import { ItemModel } from './models/ItemProject';
import { ProjectStatus } from './models/projectStatus';
import * as globby from 'globby';
import * as fileSystem from 'fs';
import { ValidaAdvpl } from './validaAdvpl';
import { version } from './../package.json';

function PrintTempo(startTime): number {
  // calcula tempo gasto
  let endTime: any = new Date();
  let timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  let seconds = Math.round(timeDiff);
  return seconds;
}

export class ValidaProjeto {
  public projeto: ItemModel[];
  public comentFontPad: string[];
  public ownerDb: string[];
  public empresas: string[];
  public local;
  public version: string = version;
  private advplExtensions = ['prw', 'prx', 'prg', 'apw', 'apl', 'tlpp'];
  protected listaDuplicados = { files: [], functions: [] };

  constructor(
    comentFontePad: string[],
    local: string,
    private log: boolean = true
  ) {
    this.local = local;
    this.comentFontPad = comentFontePad;
    this.ownerDb = [];
    this.empresas = [];
  }
  public validaProjeto(
    pathsProject: string[],
    status: ProjectStatus = new ProjectStatus()
  ): Promise<ValidaProjeto> {
    return new Promise((resolve: Function) => {
      this.projeto = [];
      let startTime: any = new Date();
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

  criaPromises(
    pathsProject: string[],
    startTime?: any,
    status: ProjectStatus = new ProjectStatus()
  ) {
    return new Promise((resolve: Function) => {
      let promisses: Promise<ValidaAdvpl>[] = [];

      // monta expressão para buscar arquivos
      let globexp: any[] = [];
      for (var i = 0; i < this.advplExtensions.length; i++) {
        globexp.push(`**/*.${this.advplExtensions[i]}`);
      }

      console.log(
        'procurando arquivos nas pastas(' + PrintTempo(startTime) + ')'
      );
      let promissesGlobby = [];
      for (var i = 0; i < pathsProject.length; i++) {
        let pathProject: string = pathsProject[i];
        // busca arquivos na pasta
        // let files: string[] = await
        promissesGlobby.push(
          globby.default(globexp, {
            cwd: pathProject,
            caseSensitiveMatch: false,
          })
        );
      }

      Promise.all(promissesGlobby).then((folder: any[]) => {
        console.log('começando a validação(' + PrintTempo(startTime) + ')');
        for (var x = 0; x < folder.length; x++) {
          let files = folder[x];
          status._total = files.length;
          for (var j = 0; j < files.length; j++) {
            status._atual = j;
            let fileName: string = files[j];
            let valida: ValidaAdvpl = new ValidaAdvpl(
              this.comentFontPad,
              this.local,
              this.log
            );
            valida.ownerDb = this.ownerDb;
            valida.empresas = this.empresas;

            if (this.log) {
              console.log('Arquivo: ' + fileName);
            }
            try {
              let conteudo = fileSystem.readFileSync(
                pathsProject + '\\' + fileName,
                'latin1'
              );
              const filePromisse = valida.validacao(
                conteudo,
                pathsProject + '\\' + fileName
              );
              promisses.push(filePromisse);
            } catch (error) {
              console.log(`Erro na abertura do arquivo ${fileName}!\n${error}`);
            }
          }
        }

        Promise.all(promisses).then((validacoes: ValidaAdvpl[]) => {
          console.log('verificando duplicados (' + PrintTempo(startTime) + ')');
          for (var idx = 0; idx < validacoes.length; idx++) {
            let validacao: ValidaAdvpl = validacoes[idx];
            let itemProjeto = new ItemModel();
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
        });
      });
    });
  }

  public verificaDuplicados(): Promise<Duplicados> {
    return new Promise((resolve: Function) => {
      let startTime: any = new Date();
      console.log('Start Duplicados');
      let listaFuncoes: string[] = [];
      let funcoesDuplicadas: string[] = [];
      let listaArquivos: string[] = [];
      let arquivosDuplicados: string[] = [];

      for (var idx = 0; idx < this.projeto.length; idx++) {
        let item: ItemModel = this.projeto[idx];
        let fonte: Fonte = item.fonte;
        //verifica se o fonte ainda existe
        try {
          fileSystem.statSync(fonte.fonte);

          for (var idx2 = 0; idx2 < fonte.funcoes.length; idx2++) {
            let funcao: Funcao = fonte.funcoes[idx2];
            // não aponta como duplicadas as static Functions ou metodos
            if (
              funcao.tipo !== Tipos['Static Function'] &&
              funcao.tipo !== Tipos.Method
            ) {
              let functionName: string = (
                funcao.nome + funcao.tipo
              ).toUpperCase();
              //monta lista de funções duplicadas
              if (listaFuncoes.indexOf(functionName) === -1) {
                listaFuncoes.push(functionName);
              } else if (funcoesDuplicadas.indexOf(functionName) === -1) {
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
          } else if (arquivosDuplicados.indexOf(fileName) === -1) {
            arquivosDuplicados.push(fileName);
          }
        } catch (e) {
          if (e.code === 'ENOENT') {
            item.content = '';
            item.errors = [];
            item.fonte.funcoes = [];
          } else {
            console.log(`Erro ao validar : ${fonte.fonte}`);
            console.log(e);
          }
        }
      }

      // guarda lista de duplicados
      let duplicadosOld = JSON.parse(JSON.stringify(this.listaDuplicados));
      this.listaDuplicados.files = JSON.parse(
        JSON.stringify(arquivosDuplicados)
      );
      this.listaDuplicados.functions = JSON.parse(
        JSON.stringify(funcoesDuplicadas)
      );

      //Procura o que mudou
      let filesIncluidos = this.listaDuplicados.files.filter(
        (x) => duplicadosOld.files.indexOf(x) === -1
      );
      let filesExcluidos = duplicadosOld.files.filter(
        (x) => this.listaDuplicados.files.indexOf(x) === -1
      );

      let functionsIncluidos = this.listaDuplicados.functions.filter(
        (x) => duplicadosOld.functions.indexOf(x) === -1
      );
      let functionsExcluidos = duplicadosOld.functions.filter(
        (x) => this.listaDuplicados.functions.indexOf(x) === -1
      );

      // marca duplicados
      for (var idx = 0; idx < this.projeto.length; idx++) {
        let item: ItemModel = this.projeto[idx];
        let fonte: Fonte = item.fonte;

        for (var idx2 = 0; idx2 < fonte.funcoes.length; idx2++) {
          let funcao: Funcao = fonte.funcoes[idx2];
          let functionName: string = (funcao.nome + funcao.tipo).toUpperCase();
          //adiciona o erro
          if (functionsIncluidos.indexOf(functionName) > -1) {
            item.errors.push(
              new Erro(
                funcao.linha,
                funcao.linha,
                traduz('validaAdvpl.functionDuplicate', this.local),
                Severity.Error
              )
            );
          }
          if (functionsExcluidos.indexOf(functionName) > -1) {
            item.errors = item.errors.filter((erro: Erro) => {
              return (
                erro.message !==
                  traduz('validaAdvpl.functionDuplicate', this.local) ||
                funcao.linha !== erro.startLine
              );
            });
          }
        }

        let fileName = fonte.fonte
          .replace(/\\/g, '/')
          .substring(fonte.fonte.replace(/\\/g, '/').lastIndexOf('/') + 1)
          .toUpperCase();
        //adiciona o erro
        if (filesIncluidos.indexOf(fileName) > -1) {
          item.errors.push(
            new Erro(
              0,
              0,
              traduz('validaAdvpl.fileDuplicate', this.local),
              Severity.Error
            )
          );
        } else if (filesExcluidos.indexOf(fileName) > -1) {
          item.errors = item.errors.filter((erro: Erro) => {
            return (
              erro.message !== traduz('validaAdvpl.fileDuplicate', this.local)
            );
          });
        }
      }
      if (this.log) {
        let errosContagem: any = this.contaErros();

        console.log(`\t${errosContagem.errors} Errors`);
        console.log(`\t${errosContagem.warnings} Warnings`);
        console.log(`\t${errosContagem.information} Informations`);
        console.log(`\t${errosContagem.hint} Hints`);
      }
      if (this.log) {
        // calcula tempo gasto
        let endTime: any = new Date();
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
  public contaErros(): any {
    let erros: any = { errors: 0, warnings: 0, information: 0, hint: 0 };

    for (var idx = 0; idx < this.projeto.length; idx++) {
      let item: ItemModel = this.projeto[idx];
      for (var idx2 = 0; idx2 < item.errors.length; idx2++) {
        let erro: Erro = item.errors[idx2];
        if (erro.severity === Severity.Error) {
          erros.errors++;
        } else if (erro.severity === Severity.Warning) {
          erros.warnings++;
        } else if (erro.severity === Severity.Information) {
          erros.information++;
        } else if (erro.severity === Severity.Hint) {
          erros.hint++;
        }
      }
    }
    return erros;
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
