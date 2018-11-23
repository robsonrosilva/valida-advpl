const fileSystem = require("file-system");
let validaAdvpl = require("../lib/validaAdvpl");
let directoryPath = __dirname + '\\files';
let conteudo = fileSystem.readFileSync(directoryPath + "\\COM ERRO", "latin1");

let objeto = new validaAdvpl.ValidaAdvpl([]);
//seta variáveis 
objeto.ownerDb = ['PROTHEUS'];
objeto.empresas= ['01'];

objeto.validacao(conteudo,"COM ERRO");
console.log(objeto.error);
