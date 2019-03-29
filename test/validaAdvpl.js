const fileSystem = require("file-system");
let mocha = require("mocha");
var describe = mocha.describe;
let validaAdvpl = require("../lib/validaAdvpl");
let directoryPath = __dirname + "\\files";
let assert = require("assert");
let objeto = new validaAdvpl.ValidaAdvpl([]);
let conteudo;

//seta variáveis
objeto.ownerDb = ["PROTHEUS"];
objeto.empresas = ["01"];

describe("Valida arquivo com erros", function() {
  this.timeout(2000000);
  describe("Confere erros encontrados", function() {
    this.timeout(2000000);
    it("Número de erros de código", async function() {
      this.timeout(2000000);
      this.enableTimeouts(false);

      //cópia de objeto
      let fonte1 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

      conteudo = fileSystem.readFileSync(
        directoryPath + "\\COM ERRO",
        "latin1"
      );
      fonte1.validacao(conteudo, "COM ERRO");

      assert.strictEqual(
        fonte1.error,
        2,
        `Existem ${fonte1.error} error no commmit.`
      );
      assert.strictEqual(
        fonte1.warning,
        13,
        `Existem ${fonte1.warning} warning no commmit.`
      );
      assert.strictEqual(
        fonte1.information,
        5,
        `Existem ${fonte1.information} information no commmit.`
      );
      assert.strictEqual(
        fonte1.hint,
        0,
        `Existem ${fonte1.hint} hint no commmit.`
      );
    });
  });
});

describe("Valida arquivo sem erros", function() {
  this.timeout(2000000);
  describe("Confere erros encontrados", function() {
    this.timeout(2000000);
    it("Número de erros de código", async function() {
      this.timeout(2000000);
      this.enableTimeouts(false);

      //cópia de objeto
      let fonte2 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

      conteudo = fileSystem.readFileSync(
        directoryPath + "\\SEM ERRO",
        "latin1"
      );
      fonte2.validacao(conteudo, "SEM ERRO");

      assert.strictEqual(
        fonte2.error,
        0,
        `Existem ${fonte2.error} error no commmit.`
      );
      assert.strictEqual(
        fonte2.warning,
        14,
        `Existem ${fonte2.warning} warning no commmit.`
      );
      assert.strictEqual(
        fonte2.information,
        0,
        `Existem ${fonte2.information} information no commmit.`
      );
      assert.strictEqual(
        fonte2.hint,
        0,
        `Existem ${fonte2.hint} hint no commmit.`
      );
    });
  });
});

describe("Valida arquivo REST", function() {
  this.timeout(2000000);
  describe("Confere erros encontrados", function() {
    this.timeout(2000000);
    it("Número de erros de código", async function() {
      this.timeout(2000000);
      this.enableTimeouts(false);

      //cópia de objeto
      let fonte3 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

      conteudo = fileSystem.readFileSync(directoryPath + "\\REST", "latin1");
      fonte3.validacao(conteudo, "REST");

      assert.strictEqual(
        fonte3.error,
        0,
        `Existem ${fonte3.error} error no commmit.`
      );
      assert.strictEqual(
        fonte3.warning,
        1,
        `Existem ${fonte3.warning} warning no commmit.`
      );
      assert.strictEqual(
        fonte3.information,
        0,
        `Existem ${fonte3.information} information no commmit.`
      );
      assert.strictEqual(
        fonte3.hint,
        0,
        `Existem ${fonte3.hint} hint no commmit.`
      );
    });
  });
});

describe("Valida arquivo WEBSRV", function() {
  this.timeout(2000000);
  describe("Confere erros encontrados", function() {
    this.timeout(2000000);
    it("Número de erros de código", async function() {
      this.timeout(2000000);
      this.enableTimeouts(false);

      //cópia de objeto
      let fonte4 = Object.assign(new validaAdvpl.ValidaAdvpl([]), objeto);

      conteudo = fileSystem.readFileSync(directoryPath + "\\WEBSRV", "latin1");
      fonte4.validacao(conteudo, "WEBSRV");

      assert.strictEqual(
        fonte4.error,
        0,
        `Existem ${fonte4.error} error no commmit.`
      );
      assert.strictEqual(
        fonte4.warning,
        1,
        `Existem ${fonte4.warning} warning no commmit.`
      );
      assert.strictEqual(
        fonte4.information,
        0,
        `Existem ${fonte4.information} information no commmit.`
      );
      assert.strictEqual(
        fonte4.hint,
        0,
        `Existem ${fonte4.hint} hint no commmit.`
      );
    });
  });
});
