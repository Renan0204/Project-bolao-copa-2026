# Bolão Copa do Mundo 2026

Projeto Hackathon - 5º Período  
Tecnologias: Java, Spring Boot, React Native

## Integrantes
- Backend: Renan Oliveira & Guilherme Vitor
- Mobile: ...
- Banco: ...
- UI/docs: ...

## Como acessar o projeto

- Baixe e instale:
https://git-scm.com/downloads/win

- Verifique a instalação:
git --version

## Clonar o repositório
- git clone https://github.com/Renan0204/Project-bolao-copa-2026.git

### Entrar na pasta:
- cd Project-bolao-copa-2026

## Branches do Projeto
- main               -> versão principal
- develop            -> desenvolvimento geral

- feature/backend    -> API Spring Boot
- feature/mobile     -> React Native
- feature/database   -> Banco de Dados
- feature/docs       -> Documentação
- Como começar a trabalhar
- Atualizar o projeto

### Sempre execute antes de iniciar:

- git checkout develop
- git pull origin develop
- Entrar na sua branch

### Backend:

git checkout feature/backend

### Mobile:

git checkout feature/mobile

### Banco:

git checkout feature/database

### Documentação:

git checkout feature/docs

## Como salvar alterações

Verificar alterações:

- git status

Adicionar arquivos:

- git add .

Criar commit:

- git commit -m "Descrição da alteração"

Exemplos:

git commit -m "Cria entidade Usuario"
git commit -m "Implementa login JWT"
git commit -m "Cria tela de login"

## Enviar para o GitHub:

- git push

Caso necessário:

- git push origin nome-da-branch

Exemplo:

git push origin feature/mobile

## Atualizar sua branch

Quando alguém enviar alterações:

- git checkout develop
- git pull origin develop
- git checkout sua-branch
- git merge develop

Exemplo:

- git checkout develop
- git pull origin develop
- git checkout feature/backend
- git merge develop
- Regras da Equipe
- Não realizar alterações diretamente na branch main.
- Cada integrante deve trabalhar apenas na sua branch.
- Realizar commits pequenos e frequentes.
- Sempre atualizar a branch antes de iniciar o desenvolvimento.
- Utilizar mensagens de commit descritivas.

## Como rodar o projeto
- Em desenvolvimento...