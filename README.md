# ts-cleanarchitecture-investimentos

Projeto de referência em **TypeScript** que implementa o sistema de investimentos descrito no capítulo **Clean Architecture** do livro (estrutura `domain`, `application`, `infrastructure`, `presentation`, `main`). Serve para validar e executar o código apresentado no material didático.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

```bash
npm install
```

## Scripts

| Comando | Descrição |
|--------|-----------|
| `npm run build` | Compila `src/` para `dist/` |
| `npm start` | Sobe a API (usa `dist/main/server.js`; rode `npm run build` antes) |
| `npm run dev` | Desenvolvimento com recarga (`ts-node-dev`) |
| `npm test` | Testes de integração (Jest + Supertest) |
| `npm run example` | Exemplo com axios (exige API em `http://localhost:3000`) |

## Executar a API

```bash
npm run build
npm start
```

- Health: `GET http://localhost:3000/health`
- Clientes: `POST http://localhost:3000/api/clients`, `PUT http://localhost:3000/api/clients/:id/balance`
- Investimentos: `POST http://localhost:3000/api/investments`, `GET http://localhost:3000/api/investments/portfolio/:clientId`

## Testes

```bash
npm test
```

Com `NODE_ENV=test`, o `MockPriceProvider` usa preços determinísticos (sem volatilidade aleatória) e trata o mercado como aberto para ordens em ação, garantindo resultados estáveis na CI e localmente.

## Exemplo HTTP (axios)

Em um terminal:

```bash
npm run build && npm start
```

Em outro:

```bash
npm run example
```

O script em `examples/usage-example.ts` cria cliente, deposita, cadastra investimentos e lê o resumo do portfólio.

## Estrutura de pastas

```
src/
├── domain/           # Entidades, value objects, interfaces de repositório
├── application/      # Casos de uso e portas (ports)
├── infrastructure/   # Implementações em memória e adaptadores
├── presentation/     # Express: DTOs, controllers, rotas, middlewares
└── main/             # Fábricas e composição (server)
```

## Licença e uso

Código educacional associado ao livro do autor; ajuste livremente para estudos ou portfólio.
