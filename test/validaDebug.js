const fileSystem = require('file-system');
let validaAdvpl = require('../lib/validaAdvpl');
let directoryPath = __dirname + '\\files';
let objeto = new validaAdvpl.ValidaAdvpl([]);
let conteudo;

//cópia de objeto
let fonte4 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

conteudo = fileSystem.readFileSync(directoryPath + '\\WEBSRV', 'latin1');
fonte4.validacao(conteudo, 'WEBSRV');

console.log(fonte4.aErros);

//cópia de objeto
let fonte3 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

conteudo = fileSystem.readFileSync(directoryPath + '\\REST', 'latin1');
fonte3.validacao(conteudo, 'REST');

console.log(fonte3.aErros);
