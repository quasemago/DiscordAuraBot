## Sobre
Projeto desenvolvido por [Bruno Patrick Formehl Ronning](https://github.com/quasemago), orientado pelo professor [Dr. Ivan Luiz Pedroso Pires](https://github.com/ivanlppires) como Trabalho de Conclusão de Curso (TCC) do curso de Sistemas de Informação da Universidade do Estado de Mato Grosso (UNEMAT).

O Objetivo do chatbot é fornecer informações sobre o campus da UNEMAT de Sinop, como horários de aulas, eventos, notícias, etc, sendo um estudo de caso dentro da universidade, a fim de avaliar a possibilidade da utilização da plataforam de comunicação digital Discord com auxílio do chatbot em um contexto educacional, sendo assim, uma alternativa aos meios de comunicação oficiais do curso.

## Dependências
O chatbot foi desenvolvido utilizando a linguagem de programação JavaScript com [Node.js](https://nodejs.org/). Além disso, para integração com a plataforma do Discord foi utilizado a biblioteca [Discord.js](https://discord.js.org/).


Projeto desenvolvido e testado nas versões do **Node.js** e **npm**:

[![NPM Version](https://img.shields.io/badge/npm-10.4.0-green)](https://www.npmjs.com/)
[![Node Version](https://img.shields.io/badge/nodejs-20.11.1-green)](https://nodejs.org/)

Bibliotecas utilizadas:

[![DiscordJS](https://img.shields.io/npm/v/discord.js?color=success&label=DiscordJS)](https://www.npmjs.com/package/discord.js)
[![MySQL2](https://img.shields.io/npm/v/mysql2?color=success&label=MySQL2)](https://www.npmjs.com/package/mysql2)
[![dotenv](https://img.shields.io/npm/v/dotenv?color=success&label=dotenv)](https://www.npmjs.com/package/dotenv)
[![sequelize](https://img.shields.io/npm/v/sequelize?color=success&label=sequelize)](https://www.npmjs.com/package/sequelize)
[![winston](https://img.shields.io/npm/v/winston?color=success&label=winston)](https://www.npmjs.com/package/winston)
[![canvas](https://img.shields.io/npm/v/@napi-rs/canvas?color=success&label=@napi-rs/canvas)](https://www.npmjs.com/package/@napi-rs/canvas)
[![luxon](https://img.shields.io/npm/v/luxon?color=success&label=luxon)](https://www.npmjs.com/package/luxon)

## Instalação
Para instalar o chatbot é necessário ter o [Node.js](https://nodejs.org/) e o [npm](https://www.npmjs.com/) (verifique as versões recomendadas [aqui](#dependências)) instalado na máquina.

Com isso instalado, basta seguir os seguintes passos:
- Faça o download da última versão do projeto [clicando aqui](https://github.com/quasemago/DiscordAuraBot/releases/latest);
- Após feito o download, extraia o arquivo em uma pasta de sua preferência;
- Abra o terminal na pasta onde o projeto foi extraído, e execute o comando `npm install` para instalar as dependências do projeto;
- Após a instalação das dependências, edite o arquivo ``.env.example`` com os dados do seu bot (id do bot, token do bot, etc), dados do banco de dados, etc e renomeie o arquivo para ``.env``;
- Após configurado o arquivo ``.env`` com todos os dados necessários, resta executar os comandos para inicialização do banco de dados, sendo:
  - `npm run migrations` para criar as tabelas no banco de dados.
  - `npm run seeders` para popular as tabelas com os dados iniciais.

### Observações
Caso seja necessário reverter as alterações feitas no banco de dados, basta executar os comandos:
- `npm run migrations:undo` para reverter as alterações feitas nas tabelas.
- `npm run seeders:undo` para reverter as alterações feitas nos dados das tabelas.

## Execução
Para executar o chatbot, é necessário ter instalado o **PM2**, que é um gerenciador de processos para aplicações Node.js em produção. Para instalar o PM2, basta executar o comando `npm install pm2 -g`.

Com o PM2 instalado, para iniciar o chatbot, basta executar o comando `npm start` dentro da raiz do projeto.