analise-advpl

Criação de modulo para validação de fontes ADVPL.

[![NPM version][npm-image]][npm-url]
[![Dependency Status][dependency-image]][dependency-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]

## Install
```sh
npm install analise-advpl --save
```

## Test
```sh
npm run test
```

## Example usage in global scope

```js
const fileSystem = require("file-system");
let validaAdvpl = require("analise-advpl");
let conteudo = fileSystem.readFileSync("c:\\arquivo.prw", "latin1");

//o primeiro parâmetro é o padrão de comentários e o segundo a localização de mensagens
let objeto = new validaAdvpl.ValidaAdvpl([],'ptb');
//define o nome do banco de dados ou owner
objeto.ownerDb = ['PROTHEUS'];
//define os códigos de empresas que irá validar na queryes 
objeto.empresas= ['01'];
//efetua a validação do fonte
objeto.validacao(conteudo,"COM ERRO");
```