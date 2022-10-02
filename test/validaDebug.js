let validaProjeto = require('../lib/src/validaProjeto');
let validaAdvpl = require('../lib/src/validaAdvpl');
const fileSystem = require('fs');
let directoryPath = __dirname + '\\files';
let objeto = new validaProjeto.ValidaProjeto([]);
let objetoFonte = new validaAdvpl.ValidaAdvpl([]);

let comentario = [
    '/*//#########################################################################################',
    'Projeto\\ \\:',
    'Modulo\\ \\ \\:',
    'Fonte\\ \\ \\ \\:',
    'Objetivo\\:',
];

//seta variáveis
objeto.ownerDb = ['PROTHEUS', 'PROTHEUS12'];
objeto.empresas = ['01', '02', '03', '04', '05', '06'];
objeto.comentFontPad = comentario;

conteudo = fileSystem.readFileSync(
    'D:\\GDrive\\Trabalho\\Workspace\\POUPEX\\ADVPL\\protheus\\SIGAATF\\PONTOS DE ENTRADA\\AF050CHK.prw',
    'latin1'
);
let fonte2 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);
fonte2.validacao(conteudo, 'SEM ERRO');

console.log(fonte2);
console.log('fim');

objeto.validaProjeto(['D:\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus']).then((validaPrj) => {
    //objeto.validaProjeto(['C:\\Users\\Robson\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus\\SIGAATF']).then((validaPrj) => {
    console.log(validaPrj)
})
//objeto.validaProjeto('D:\\rogerio\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus').then((validaPrj) => {
//    //objeto.validaProjeto('C:\\Users\\Robson\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus\\SIGAATF').then((validaPrj) => {
//    fileSystem.writeFileSync('d:\\valida-advpl.json', JSON.stringify(validaPrj), {
//        mode: 0o755
//    });
//})
