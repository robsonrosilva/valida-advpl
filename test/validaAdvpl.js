const fileSystem = require("file-system");
let validaAdvpl = require("../lib/validaAdvpl");
let directoryPath = __dirname + '\\files';
let conteudo = fileSystem.readFileSync(directoryPath + "\\COM ERRO", "latin1");

let objeto = new validaAdvpl.ValidaAdvpl([]);
//seta variáveis 
objeto.ownerDb = ['PROTHEUS'];
objeto.empresas= ['01'];

describe("Valida arquivo com erros", function () {
	this.timeout(2000000);
	describe("Confere erros encontrados", function () {
		this.timeout(2000000);
		it("Número de erros de código", async function () {
            let assert = require("assert");
			this.timeout(2000000);
			this.enableTimeouts(false);
            objeto.validacao(conteudo,"COM ERRO");
            assert.strictEqual(objeto.error, 2, `Existem ${objeto.error} error no commmit.`);
            assert.strictEqual(objeto.warning, 13, `Existem ${objeto.warning} warning no commmit.`);
            assert.strictEqual(objeto.information, 5, `Existem ${objeto.information} information no commmit.`);
            assert.strictEqual(objeto.hint, 0, `Existem ${objeto.hint} hint no commmit.`);
		});
	});
});
