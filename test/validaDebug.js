
let validaProjeto = require('../lib/validaProjeto');
let objeto = new validaProjeto.validaProjeto([]);

let comentario = [
    "/*//#########################################################################################",
    "Projeto\\ \\:",
    "Modulo\\ \\ \\:",
    "Fonte\\ \\ \\ \\:",
    "Objetivo\\:"
]

//seta variáveis
objeto.ownerDb = ['PROTHEUS'];
objeto.empresas = ['01'];
objeto.comentFontPad = comentario;

objeto.validaProjeto('D:\\rogerio\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus')
//objeto.validaProjeto('C:\\Users\\Robson\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus')
