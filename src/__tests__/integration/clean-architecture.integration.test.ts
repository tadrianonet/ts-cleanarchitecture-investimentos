import request from 'supertest';
import { Server } from '../../main/server';

describe('Clean Architecture Integration Tests', () => {
  let server: Server;
  let app: ReturnType<Server['getApp']>;

  beforeAll(() => {
    server = new Server(0);
    app = server.getApp();
  });

  describe('Client Management', () => {
    test('deve criar cliente com sucesso', async () => {
      const clientData = {
        name: 'Thiago Adriano',
        email: 'thiago.adriano@email.com',
        initialBalance: 10000
      };

      const response = await request(app).post('/api/clients').send(clientData).expect(201);

      expect(response.body).toMatchObject({
        name: 'Thiago Adriano',
        email: 'thiago.adriano@email.com',
        balance: 10000
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    test('deve atualizar saldo do cliente', async () => {
      const clientData = {
        name: 'Maria Santos',
        email: 'maria@email.com',
        initialBalance: 5000
      };

      const createResponse = await request(app).post('/api/clients').send(clientData).expect(201);

      const clientId = createResponse.body.id;

      const depositResponse = await request(app)
        .put(`/api/clients/${clientId}/balance`)
        .send({
          amount: 2000,
          operation: 'DEPOSIT'
        })
        .expect(200);

      expect(depositResponse.body).toMatchObject({
        clientId,
        previousBalance: 5000,
        newBalance: 7000,
        operation: 'DEPOSIT',
        amount: 2000
      });
    });
  });

  describe('Investment Management', () => {
    test('deve criar investimento com sucesso', async () => {
      const clientData = {
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        initialBalance: 15000
      };

      const clientResponse = await request(app).post('/api/clients').send(clientData).expect(201);

      const clientId = clientResponse.body.id;

      const investmentData = {
        clientId,
        code: 'PETR4',
        amount: 5000,
        type: 'ACAO',
        expectedReturn: 0.15
      };

      const investmentResponse = await request(app)
        .post('/api/investments')
        .send(investmentData)
        .expect(201);

      expect(investmentResponse.body).toMatchObject({
        clientId,
        code: 'PETR4',
        amount: 5000,
        type: 'ACAO',
        expectedReturn: 0.15
      });
      expect(investmentResponse.body.id).toBeDefined();
      expect(investmentResponse.body.purchaseDate).toBeDefined();
    });

    test('deve obter resumo do portfólio', async () => {
      const clientData = {
        name: 'Ana Lima',
        email: 'ana@email.com',
        initialBalance: 20000
      };

      const clientResponse = await request(app).post('/api/clients').send(clientData).expect(201);

      const clientId = clientResponse.body.id;

      const investments = [
        { code: 'PETR4', amount: 5000, type: 'ACAO' },
        { code: 'CDB001', amount: 8000, type: 'RENDA_FIXA' },
        { code: 'HASH11', amount: 3000, type: 'FII' }
      ];

      for (const inv of investments) {
        await request(app)
          .post('/api/investments')
          .send({ clientId, ...inv })
          .expect(201);
      }

      const portfolioResponse = await request(app)
        .get(`/api/investments/portfolio/${clientId}`)
        .expect(200);

      expect(portfolioResponse.body).toMatchObject({
        clientId,
        clientName: 'Ana Lima',
        totalInvested: 16000,
        isWellDiversified: true
      });

      expect(portfolioResponse.body.distribution).toHaveLength(3);
      expect(portfolioResponse.body.investments).toHaveLength(3);
      expect(portfolioResponse.body.currentValue).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('deve retornar erro para cliente inexistente', async () => {
      await request(app)
        .post('/api/investments')
        .send({
          clientId: 'cliente-inexistente',
          code: 'PETR4',
          amount: 1000,
          type: 'ACAO'
        })
        .expect(404);
    });

    test('deve retornar erro para saldo insuficiente', async () => {
      const clientData = {
        name: 'Cliente Pobre',
        email: 'pobre@email.com',
        initialBalance: 100
      };

      const clientResponse = await request(app).post('/api/clients').send(clientData).expect(201);

      const clientId = clientResponse.body.id;

      await request(app)
        .post('/api/investments')
        .send({
          clientId,
          code: 'PETR4',
          amount: 10000,
          type: 'ACAO'
        })
        .expect(400);
    });
  });
});
