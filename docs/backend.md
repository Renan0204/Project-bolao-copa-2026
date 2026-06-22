# Backend - Bolão Copa 2026

## Tecnologias utilizadas

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Thymeleaf
* Bootstrap
* MySQL
* Maven

## Como rodar o backend

Entre na pasta do backend:

```bash
cd backend/bolao-copa-api
```

Configure o banco de dados MySQL com o nome:

```txt
bolao_copa
```

Depois rode o projeto:

```bash
.\mvnw.cmd spring-boot:run
```

O sistema estará disponível em:

```txt
http://localhost:8080
```

## Rotas principais do painel administrativo

### Dashboard

```txt
http://localhost:8080
http://localhost:8080/dashboard
```

### Seleções

```txt
http://localhost:8080/selecoes
http://localhost:8080/selecoes/novo
```

Funcionalidades:

* Listar seleções
* Cadastrar seleção
* Editar seleção
* Excluir seleção

### Partidas

```txt
http://localhost:8080/partidas
http://localhost:8080/partidas/novo
```

Funcionalidades:

* Listar partidas
* Cadastrar partida
* Editar partida
* Excluir partida

### Resultados

```txt
/resultados/lancar/{id}
```

Funcionalidades:

* Lançar placar da partida
* Atualizar status da partida para Finalizada
* Exibir placar na listagem e no dashboard

## Funcionalidades implementadas no painel administrativo

* Cadastro de seleções
* Listagem de seleções
* Edição de seleções
* Exclusão de seleções
* Cadastro de partidas
* Listagem de partidas
* Edição de partidas
* Exclusão de partidas
* Lançamento de resultado
* Dashboard com resumo do sistema
* Visual das telas com Bootstrap

## Observações

Antes de cadastrar uma partida, é necessário cadastrar pelo menos duas seleções.

Para testar o lançamento de resultado, cadastre uma partida, acesse a tela de partidas e clique no botão Resultado.
