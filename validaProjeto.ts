import { Erro, Severity } from './models/Erro';
import { Duplicados } from './models/Duplicados';
import { Fonte, Funcao, Tipos } from './fonte';
import { ItemModel } from './models/ItemProject';
import * as globby from 'globby';
import * as fileSystem from 'fs';
import { ValidaAdvpl } from './validaAdvpl';
import { version } from './package.json';

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
  public async validaProjeto(pathProject: string): Promise<ValidaProjeto> {
    return new Promise(async (resolve: Function) => {
      this.projeto = [];
      // monta expressão para buscar arquivos
      let globexp: any[] = [];
      for (var i = 0; i < this.advplExtensions.length; i++) {
        globexp.push(`**/*.${this.advplExtensions[i]}`);
      }
      // busca arquivos na pasta
      let files: string[] = await globby.sync(globexp, {
        cwd: pathProject,
        caseSensitiveMatch: false
      });

      // valida arquivos
      let promisses: Promise<ValidaAdvpl>[] = [];

      let startTime: any = new Date();
      if (this.log) {
        console.log(startTime);
        console.log('Analise de Projeto: ' + pathProject);
      }

      files.forEach((fileName: string) => {
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
        let conteudo = fileSystem.readFileSync(
          pathProject + '\\' + fileName,
          'latin1'
        );

        promisses.push(
          valida.validacao(conteudo, pathProject + '\\' + fileName)
        );
      });

      Promise.all(promisses).then((validacoes: ValidaAdvpl[]) => {
        validacoes.forEach((validacao: ValidaAdvpl) => {
          let itemProjeto = new ItemModel();
          itemProjeto.content = validacao.conteudoFonte;
          itemProjeto.errors = validacao.aErros;
          itemProjeto.fonte = validacao.fonte;

          this.projeto.push(itemProjeto);
        });

        // verifica duplicados
        this.verificaDuplicados().then(() => {
          if (this.log) {
            // calcula tempo gasto
            let endTime: any = new Date();
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
    });
  }

  public verificaDuplicados(): Promise<Duplicados> {
    return new Promise((resolve: Function) => {
      let listaFuncoes: string[] = [];
      let funcoesDuplicadas: string[] = [];
      let listaArquivos: string[] = [];
      let arquivosDuplicados: string[] = [];

      this.projeto.forEach((item: ItemModel) => {
        let fonte: Fonte = item.fonte;
        //verifica se o fonte ainda existe
        try {
          fileSystem.statSync(fonte.fonte);

          fonte.funcoes.forEach((funcao: Funcao) => {
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
          });

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
      });

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
        x => duplicadosOld.files.indexOf(x) === -1
      );
      let filesExcluidos = duplicadosOld.files.filter(
        x => this.listaDuplicados.files.indexOf(x) === -1
      );

      let functionsIncluidos = this.listaDuplicados.functions.filter(
        x => duplicadosOld.functions.indexOf(x) === -1
      );
      let functionsExcluidos = duplicadosOld.functions.filter(
        x => this.listaDuplicados.functions.indexOf(x) === -1
      );

      // marca duplicados
      this.projeto.forEach((item: ItemModel) => {
        let fonte: Fonte = item.fonte;

        fonte.funcoes.forEach((funcao: Funcao) => {
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
        });

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
      });
      if (this.log) {
        let errosContagem: any = this.contaErros();

        console.log(`\t${errosContagem.errors} Errors`);
        console.log(`\t${errosContagem.warnings} Warnings`);
        console.log(`\t${errosContagem.information} Informations`);
        console.log(`\t${errosContagem.hint} Hints`);
      }
      resolve();
    });
  }
  public contaErros(): any {
    let erros: any = { errors: 0, warnings: 0, information: 0, hint: 0 };

    this.projeto.forEach((item: ItemModel) => {
      item.errors.forEach((erro: Erro) => {
        if (erro.severity === Severity.Error) {
          erros.errors++;
        } else if (erro.severity === Severity.Warning) {
          erros.warnings++;
        } else if (erro.severity === Severity.Information) {
          erros.information++;
        } else if (erro.severity === Severity.Hint) {
          erros.hint++;
        }
      });
    });
    return erros;
  }
}

function traduz(key, local) {
  let locales: string[] = ['en', 'pt-br'];
  let i18n = require('i18n');
  i18n.configure({
    locales: locales,
    directory: __dirname + '/locales'
  });
  i18n.setLocale(locales.indexOf(local) + 1 ? local : 'en');
  return i18n.__(key);
}
