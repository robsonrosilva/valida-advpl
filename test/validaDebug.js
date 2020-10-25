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
objeto.empresas = ['01', '02'];
objeto.comentFontPad = comentario;

conteudo = fileSystem.readFileSync(
    'D:\\GDRIVE\\Trabalho\\WORKSPACE\\NPM\\analise-advpl\\test\\files\\ALEATORIO',
    'latin1'
);
objetoFonte.ownerDb = ['PROTHEUS', 'PROTHEUS12'];
objetoFonte.empresas = ['01', '02'];
objetoFonte.comentFontPad = comentario;
objetoFonte.validacao(conteudo, 'PXGPEM19.prw');
console.log(objetoFonte);
/*

objeto.validaProjeto(['D:\\rogerio\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus']).then((validaPrj) => {
    //objeto.validaProjeto(['C:\\Users\\Robson\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus\\SIGAATF']).then((validaPrj) => {
    fileSystem.writeFileSync('d:\\valida-advpl.json', JSON.stringify(validaPrj), {
        mode: 0o755
    });
    console.log(objeto)
    console.log('kkk')
})
//objeto.validaProjeto('D:\\rogerio\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus').then((validaPrj) => {
//    //objeto.validaProjeto('C:\\Users\\Robson\\GDRIVE\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus\\SIGAATF').then((validaPrj) => {
//    fileSystem.writeFileSync('d:\\valida-advpl.json', JSON.stringify(validaPrj), {
//        mode: 0o755
//    });
//})
*/