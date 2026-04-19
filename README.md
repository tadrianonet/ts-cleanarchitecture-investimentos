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
| `npm test` | Testes Jest (integração com Supertest e unitários) |
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

Há também testes **unitários** em `src/__tests__/unit/`, por exemplo [`create-investment.test.ts`](src/__tests__/unit/application/create-investment.test.ts), que mockam `isMarketOpen` e cobrem o cenário de mercado fechado sem depender do dia da semana (cenário que os testes de integração deixam de exercitar de propósito).

### API local em fim de semana ou fora do horário

Fora de `NODE_ENV=test`, o `MockPriceProvider.isMarketOpen()` considera segunda a sexta, das 10h às 17h (horário local da máquina). Em domingo, um `POST` de investimento em ação pode retornar erro de mercado fechado, o que é esperado pela regra de negócio. Para desenvolvimento, você pode forçar mercado aberto:

```bash
MOCK_MARKET_ALWAYS_OPEN=1 npm start
```

(ou `true` no lugar de `1`).

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
