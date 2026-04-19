import { Router } from 'express';
import { InvestmentController } from '../controllers/investment-controller';

export const createInvestmentRoutes = (investmentController: InvestmentController): Router => {
  const router = Router();

  router.post('/', (req, res) => {
    void investmentController.create(req, res);
  });
  router.get('/portfolio/:clientId', (req, res) => {
    void investmentController.getPortfolioSummary(req, res);
  });

  return router;
};
