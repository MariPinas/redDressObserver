# API - Notificação de Estoque (Node.js + Express)

Este é o backend da aplicação de loja com notificação de estoque. Ele fornece uma API REST para gerenciar produtos, além de endpoints para inscrição de e-mails e notificação em tempo real via WebSocket.

## Funcionalidades

- Adição e remoção de produtos do estoque
- Consulta da quantidade em estoque
- Inscrição para notificação quando o estoque estiver disponível
- Envio de notificações por WebSocket quando um item volta ao estoque
- Servidor HTTPS com certificado local

## Tecnologias

- Node.js
- TypeScript
- Express
- WebSocket (ws)
- HTTPS com certificado local
- Arquitetura com princípios SOLID e alguns Design Patterns (Decorator, Factory Method, Adapter, Composite e Command)

## Requisitos

- Node.js 18+
- Certificados SSL gerados localmente (por exemplo, usando `mkcert`)

## Instalação

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```
2. Rodar o projeto
   ```bash
   npm run dev ou npm start
   ```
## Endpoints principais
- POST /api/product/add: Adiciona produtos ao estoque
- POST /api/product/remove: Remove produtos do estoque
- GET /api/product/quantity?name=produto: Consulta a quantidade atual
- POST /api/notify/subscribe: Inscreve um e-mail para receber notificação

- WebSocket: wss://localhost:3040 para notificações em tempo real

## Segurança com HTTPS (SSL)
Este backend já está configurado para usar HTTPS com SSL, garantindo conexões seguras.

O servidor utiliza https.createServer() com chave e certificado gerados localmente.

Os arquivos de certificado devem estar na pasta cert/, com os seguintes nomes:

key.pem – chave privada
cert.pem – certificado público
