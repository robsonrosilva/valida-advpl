let validaProjeto = require('../lib/validaProjeto');
let validaAdvpl = require('../lib/validaAdvpl');
const fileSystem = require("fs");
let directoryPath = __dirname + '\\files';
let objeto = new validaProjeto.ValidaProjeto([]);
let objetoFonte = new validaAdvpl.ValidaAdvpl([]);

let comentario = [
    "/*//#########################################################################################",
    "Projeto\\ \\:",
    "Modulo\\ \\ \\:",
    "Fonte\\ \\ \\ \\:",
    "Objetivo\\:"
]

//seta variáveis
objeto.ownerDb = ['PROTHEUS', 'PROTHEUS12'];
objeto.empresas = ['01', '02'];
objeto.comentFontPad = comentario;

conteudo = fileSystem.readFileSync(
    'C:\\Users\\Robson\\Dropbox\\Trabalho\\WORKSPACE\\NPM\\analise-advpl\\test\\files\\ALEATORIO',
    'latin1'
);
objetoFonte.ownerDb = ['PROTHEUS', 'PROTHEUS12'];
objetoFonte.empresas = ['01', '02'];
objetoFonte.comentFontPad = comentario;
objetoFonte.validacao(conteudo, 'PXGPEM19.prw');

console.log(objetoFonte);

//objeto.validaProjeto('D:\\rogerio\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus')
//objeto.validaProjeto('C:\\Users\\Robson\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus\\SIGAATF').then((validaPrj) => {
//    fileSystem.writeFileSync('d:\\valida-advpl.json', JSON.stringify(validaPrj), {
//        mode: 0o755
//    });
//})