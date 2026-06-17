# Backend - Bolão Copa do Mundo 2026

API desenvolvida em Java + Spring Boot para o projeto Hackathon.

## Responsabilidades

- Autenticação de usuários
- Cadastro e login
- Gerenciamento de seleções
- Gerenciamento de partidas
- Registro de palpites
- Cálculo de pontuação
- Ranking geral
- Painel administrativo com Thymeleaf

## Estrutura de pacotes

- config: configurações gerais do projeto
- controller: controllers REST e páginas admin
- dto: objetos de entrada e saída de dados
- entity: entidades do banco de dados
- enums: tipos fixos do sistema
- exception: tratamento de erros
- repository: acesso ao banco de dados
- security: autenticação e autorização
- service: regras de negócio