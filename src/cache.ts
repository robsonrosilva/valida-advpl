import * as os from 'os';
import * as fileSystem from 'fs';
import { FileCache } from './models/FileCache';
import { ValidaAdvpl } from './validaAdvpl';

export class Cache {
  private tmpFolder: string = os.tmpdir();
  public filesInCache: FileCache[];
  constructor(private fileCache: string) {
    this.fileCache =
      this.fileCache.replace(/\\/g, '').replace(/\:/g, '').replace(/\//g, '') +
      '.cache';
    let content: any;
    try {
      if (!fileSystem.existsSync(this.tmpFolder + '\\' + this.fileCache)) {
        fileSystem.writeFileSync(this.tmpFolder + '\\' + this.fileCache, '', {
          mode: 0o755,
        });
      }
      content = fileSystem.readFileSync(
        this.tmpFolder + '\\' + this.fileCache,
        'utf8'
      );
    } catch (err) {
      // An error occurred
      console.error(err);
    }
    if (content) {
      this.filesInCache = JSON.parse(content);
    } else {
      this.filesInCache = [];
    }
  }
  //adiciona o item e grava em cache
  addFile(file: FileCache) {
    // Faz uma cópia do objeto pois como uso sempre o mesmo evito maiores problemas
    file.validaAdvpl = JSON.parse(JSON.stringify(file.validaAdvpl));

    const vldClean = {
      aErros: file.validaAdvpl.aErros,
      includes: file.validaAdvpl.includes,
      error: file.validaAdvpl.error,
      warning: file.validaAdvpl.warning,
      information: file.validaAdvpl.information,
      hint: file.validaAdvpl.hint,
      version: file.validaAdvpl.version,
      hash: file.validaAdvpl.hash,
      fonte: file.validaAdvpl.fonte,
    } as ValidaAdvpl;

    this.filesInCache.push({
      file: file.file,
      hash: file.hash,
      validaAdvpl: vldClean,
    });
    try {
      fileSystem.writeFileSync(
        this.tmpFolder + '\\' + this.fileCache,
        JSON.stringify(JSON.parse(JSON.stringify(this.filesInCache))),
        { flag: 'w' }
      );
    } catch (err) {
      // An error occurred
      console.error(err);
    }
  }

  //remove o item e grava em cache
  delFile(fsPath: string) {
    this.filesInCache = this.filesInCache.filter(
      (_file) => _file.file !== fsPath
    );
    try {
      fileSystem.writeFileSync(
        this.tmpFolder + '\\' + this.fileCache,
        JSON.stringify(this.filesInCache),
        { flag: 'w' }
      );
    } catch (err) {
      // An error occurred
      console.error(err);
    }
  }
}
