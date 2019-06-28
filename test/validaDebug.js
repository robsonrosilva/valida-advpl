const fileSystem = require('file-system');
let validaAdvpl = require('../lib/validaAdvpl');
let directoryPath = __dirname + '\\files';
let objeto = new validaAdvpl.ValidaAdvpl([]);
let conteudo;

//cópia de objeto
let fonte1 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

conteudo = fileSystem.readFileSync(directoryPath + '\\SEM ERRO', 'latin1');
fonte1.validacao(conteudo, 'SEM ERRO');

console.log(fonte1);
//cópia de objeto
let fonte2 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

conteudo = fileSystem.readFileSync(directoryPath + '\\COM ERRO', 'latin1');
fonte2.validacao(conteudo, 'COM ERRO');

console.log(fonte2);

//cópia de objeto
let fonte3 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

conteudo = fileSystem.readFileSync(directoryPath + '\\WEBSRV', 'latin1');
fonte3.validacao(conteudo, 'WEBSRV');

console.log(fonte3);

//cópia de objeto
let fonte4 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

conteudo = fileSystem.readFileSync(directoryPath + '\\REST', 'latin1');
fonte4.validacao(conteudo, 'REST');

console.log(fonte4);
