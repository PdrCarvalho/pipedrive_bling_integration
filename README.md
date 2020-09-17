# pipedrive_bling_integration #
## Descrição ##
Aplicação integra as plataformas Pipedrive e Bling.
## Inicializar Aplicação ##
Primeiramente deve-se instalar as dependências: `yarn` ou `npm install`.
### Modo de desenvolvimento ##
Para iniciar o projeto em modo de desenvolvedor:

`yarn dev`
### Modo de produção ###
Para o modo de produção temos que inicamente trasnpilar o codigo para um js mais antigo com :

`yarn build`

Depois iniciar a aplicação:

`yarn start`

## Rotas ##

`http://localhost:3333/report-per-day/` Mostrará um relatorio do valor total dos pedido ganhos por dia.

`http://localhost:3333/` Mostrará todos os pedido ganhos no Pipedrive que foram cadastrados no Bling agrupados por dia.
