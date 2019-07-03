let validaProjeto = require('../lib/validaProjeto');
const fileSystem = require("fs");
let objeto = new validaProjeto.ValidaProjeto([]);

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

// objeto.validaProjeto('D:\\rogerio\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL\\Protheus')
objeto.validaProjeto('C:\\Users\\Robson\\Dropbox\\Trabalho\\WORKSPACE\\POUPEX\\ADVPL').then((validaPrj) => {
    fileSystem.writeFileSync('d:\\valida-advpl.json', JSON.stringify(validaPrj), {
        mode: 0o755
    });
})