## Sobre
Projeto de um chatbot para a plataforma Discord, com o objetivo de um estudo de caso na Universidade do Estado de Mato Grosso do campus de Sinop.

O chatbot foi desenvolvido utilizando a linguagem de programação JavaScript com o framework [NodeJS](https://nodejs.org/), e para integração com a plataforma do Discord foi utilizado a biblioteca [discord.js](https://discord.js.org/).

## Dependências
Projeto desenvolvido e testado nas versões do NodeJS e NPM:

[![NPM Version](https://img.shields.io/badge/npm-9.8.1-green)](https://www.npmjs.com/)
[![Node Version](https://img.shields.io/badge/nodejs-18.17.1-green)](https://nodejs.org/)

Bibliotecas utilizadas:

[![DiscordJS](https://img.shields.io/npm/v/discord.js?color=success&label=DiscordJS)](https://www.npmjs.com/package/discord.js)
[![MySQL2](https://img.shields.io/npm/v/mysql2?color=success&label=MySQL2)](https://www.npmjs.com/package/mysql2)
[![dotenv](https://img.shields.io/npm/v/dotenv?color=success&label=dotenv)](https://www.npmjs.com/package/dotenv)
[![sequelize](https://img.shields.io/npm/v/sequelize?color=success&label=sequelize)](https://www.npmjs.com/package/cronstrue)
[![@devraelfreeze/discordjs-pagination](https://img.shields.io/npm/v/@devraelfreeze/discordjs-pagination?color=success&label=DiscordJS%20Pagination)](https://www.npmjs.com/package/@devraelfreeze/discordjs-pagination)

## Instalação
Para instalar o chatbot é necessário ter o [NodeJS](https://nodejs.org/) e o [NPM](https://www.npmjs.com/) (verifique as versões recomendadas [aqui](#dependências)) instalado na máquina.

Com isso instalado, basta seguir os seguintes passos:
- Faça o download da última versão do projeto [clicando aqui](https://github.com/quasemago/DiscordMaidBotJS/releases/latest);
- Após feito o download, extraia o arquivo em uma pasta de sua preferência;
- Abra o terminal na pasta onde o projeto foi extraído, e execute o comando `npm install` para instalar as dependências do projeto;
- Após a instalação das dependências, edite o arquivo ``.env.example`` com os dados do seu bot (id do bot, token do bot, etc) e renomeie o arquivo para ``.env``;
- Após isso, basta executar o comando `node index` no terminal para iniciar o bot.