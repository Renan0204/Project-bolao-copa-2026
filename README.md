# Bolão Copa do Mundo 2026

Projeto desenvolvido para o Hackathon do 5º Período.

## Tecnologias

* Java
* Spring Boot
* MySQL
* Thymeleaf
* Bootstrap
* React Native

## Estrutura do projeto

```txt
backend/
mobile/
database/
docs/
```

## Como clonar o projeto

```bash
git clone https://github.com/Renan0204/Project-bolao-copa-2026.git
cd Project-bolao-copa-2026
```

## Branches principais

```txt
main              versão final
develop           desenvolvimento geral
feature/backend   backend Spring Boot
feature/mobile    aplicativo React Native
feature/database  banco de dados
feature/docs      documentação
```

## Como salvar alterações

```bash
git status
git add .
git commit -m "Mensagem do commit"
git push origin nome-da-branch
```

## Como rodar o backend

Entre na pasta do backend:

```bash
cd backend/bolao-copa-api
```

Crie o banco de dados MySQL:

```txt
bolao_copa
```

Rode o projeto:

```bash
.\mvnw.cmd spring-boot:run
```

Acesse:

```txt
http://localhost:8080
```

## Documentação

A documentação do backend está em:

```txt
docs/backend.md
```
