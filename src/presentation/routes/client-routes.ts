import { Router } from 'express';
import { ClientController } from '../controllers/client-controller';

export const createClientRoutes = (clientController: ClientController): Router => {
  const router = Router();

  router.post('/', (req, res) => {
    void clientController.create(req, res);
  });
  router.put('/:id/balance', (req, res) => {
    void clientController.updateBalance(req, res);
  });

  return router;
};
