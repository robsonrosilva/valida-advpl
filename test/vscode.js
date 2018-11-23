let erro = require("./../lib/erro");
let mensagem = 'mensagem de teste';
//teste de diagnostic
let error = new erro.Erro(0,0,mensagem, erro.Severity.Warning);
//confere dados 
console.log(error.severity);
console.log(error.message);

console.log(erro.Severity.Error === error.severity)
