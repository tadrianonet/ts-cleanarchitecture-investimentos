import express from 'express';
import cors from 'cors';
import { ControllerFactory } from './factories/controller-factory';
import { createClientRoutes } from '../presentation/routes/client-routes';
import { createInvestmentRoutes } from '../presentation/routes/investment-routes';
import { errorHandler } from '../presentation/middlewares/error-handler';
import { validateContentType, validateRequestSize } from '../presentation/middlewares/validation';

export class Server {
  private app: express.Application;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(validateContentType);
    this.app.use(validateRequestSize('10mb'));
  }

  private setupRoutes(): void {
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    const clientController = ControllerFactory.createClientController();
    const investmentController = ControllerFactory.createInvestmentController();

    this.app.use('/api/clients', createClientRoutes(clientController));
    this.app.use('/api/investments', createInvestmentRoutes(investmentController));

    this.app.use((_req, res) => {
      res.status(404).json({
        error: 'Endpoint não encontrado'
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  start(): void {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta ${this.port}`);
      console.log(`Health check: http://localhost:${this.port}/health`);
      console.log(`API Base URL: http://localhost:${this.port}/api`);
    });
  }

  getApp(): express.Application {
    return this.app;
  }
}

if (require.main === module) {
  const server = new Server(3000);
  server.start();
}
