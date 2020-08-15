Sequência de criação:

$ yarn init -y // criou apenas o package.json

$ touch src/server.ts // cria arquivo ts

$ yarn add typescript -D // instala ts apenas em desenvolvimento

$ yarn tsc --init // criou arquivos de configuração

$ yarn add ts-node-dev -D // intala dependencia que executa servidor e ATUALIZA SOZINHO quando tem alteração

adicionou em: package.json:
"scripts": {
    "start": "ts-node-dev --transpile-only --ignore-watch node_modules --respawn src/server.ts"
  }, // roda o script ao fazer '$ yarn start'
/* FLAGS:
 * --transpile-only -> não verifica erros para ts, rodando mais rápido
 * --ignore-watch node_modules -> não converte arquivos de terceiros (biblioteca)
 * --respawn -> menter server ativo atualizando ao salvar
 */

$ yarn add @types/express -D // instalação do micropacote express

$ yarn add knex sqlite3 -D / instalação knex: gerencia sqlite3