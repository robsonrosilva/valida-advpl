import { lstat } from 'fs';
import { ProjectStatus } from '../../src/models/projectStatus';
import { ValidaAdvpl } from './../validaAdvpl';

export class Fila {
  status: ProjectStatus = new ProjectStatus();
  list: ItensValidacao[] = [];
  returnList: ValidaAdvpl[] = [];
  numberItem: number = 0;
  numberTotal: number = 0;

  run(): Promise<ValidaAdvpl[]> {
    return new Promise((resolve: Function) => {
      // monta listas de processamento
      const listaProcessamento = [[]];

      //junta de 10 em 10
      for (var i = 0; i < this.list.length; i++) {
        if (listaProcessamento[listaProcessamento.length - 1].length < 10) {
          listaProcessamento[listaProcessamento.length - 1].push(this.list[i]);
        } else {
          listaProcessamento.push([this.list[i]]);
        }
      }

      // seta variáveis de controle
      this.numberTotal = this.list.length;
      this.numberItem = 0;

      // Processa de 10 em 10
      const runGroup = (item: number) => {
        if (item == listaProcessamento.length) {
          resolve(this.returnList);
          return;
        }

        let promisses = [];
        for (var i = 0; i < listaProcessamento[item].length; i++) {
          promisses.push(
            listaProcessamento[item][i].validaAdvpl.validacao(
              listaProcessamento[item][i].content,
              listaProcessamento[item][i].fileName,
              listaProcessamento[item][i].project
            )
          );
        }
        Promise.all(promisses).then((validacoes: ValidaAdvpl[]) => {
          for (var i = 0; i < validacoes.length; i++) {
            this.returnList.push(validacoes[i]);
          }

          // Incrementa os Processados
          this.numberItem += validacoes.length;

          //console.log('' + this.numberItem + '/' + this.numberTotal);

          runGroup(item + 1);
        });
      };

      runGroup(0);
    });
  }
}

export class ItensValidacao {
  finally: boolean = false;
  running: boolean = false;
  fileName: string;
  project: string;
  content: string;
  validaAdvpl: ValidaAdvpl;

  constructor(
    fileName: string,
    project: string,
    content: string,
    validaAdvpl: ValidaAdvpl
  ) {
    this.fileName = fileName;
    this.project = project;
    this.content = content;
    this.validaAdvpl = validaAdvpl;
  }
}
