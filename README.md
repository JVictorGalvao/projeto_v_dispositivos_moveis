# API de Exemplo - Edital 43/2021

Para facilitar o desenvolvimento do projeto React Native, criamos uma API de exemplo que deve ser utilizada para o consumo e a persistência de dados.

## Instalação das Dependências

Para instalar as dependências ([JSON Server](https://github.com/typicode/json-server) e [JSON Server Auth](https://github.com/jeremyben/json-server-auth)) para a execução da API, utilize um dos comandos abaixo:
```
# NPM
npm install -D json-server json-server-auth

# Yarn
yarn add -D json-server json-server-auth
```

## Execução da API

Para executar a API, basta executar o seguinte comando:

```
json-server-auth --watch db.json --host 0.0.0.0 --port 3004
```

Com isso, a API estará disponível para acesso no endereço ```http://localhost:3004/``` podendo ser acessada externamente dentro da sua rede local pelo IP da sua máquina. Exemplo: ```http://192.168.0.13:3004/```.

## Serviços Disponíveis

Abaixo são listados os serviços disponibilizados pela API para o desenvolvimento das funcionalidades do aplicativo.
```
# Pontos de Vacinação
GET     /estabelecimentos-saude

# Grupos de Atendimento
GET     /grupos-atendimento

# Agendamentos
GET     /agendamentos
GET     /agendamentos/{id}
POST    /agendamentos
PUT     /agendamentos/{id}
PATCH   /agendamentos/{id}

# Usuários
GET     /users
POST    /users

# Autenticação JWT
POST    /login
```

## Filtros

Utilize os campos desejados para busca nos parâmetros da URL (_querystring_) para realizar uma busca nos dados retornados.

Exemplo:
```
GET     /estabelecimentos-saude?dsc_cidade=Natal
GET     /estabelecimentos-saude?dsc_bairro=ALECRIM
GET     /estabelecimentos-saude?nom_estab_like=Marajo
```

## Paginação

Utilize ```_page``` e ```_limit``` (opcional) para paginar os dados retornados. Por padrão, a paginação é feita de 10 em 10 itens.

Exemplo:
```
GET     /estabelecimentos-saude?_page=7
GET     /estabelecimentos-saude?_page=7&_limit=20
```

## Ordenação

Utilize ```_sort``` e ```_order``` para ordernar os dados retornados. Exemplo:
```
GET     /agendamentos?_sort=data&_order=asc
GET     /agendamentos?_sort=data,hora&_order=desc,asc
```
