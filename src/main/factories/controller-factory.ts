import { ClientController } from '../../presentation/controllers/client-controller';
import { InvestmentController } from '../../presentation/controllers/investment-controller';
import { UseCaseFactory } from './use-case-factory';

export class ControllerFactory {
  static createClientController(): ClientController {
    return new ClientController(
      UseCaseFactory.createClientUseCase(),
      UseCaseFactory.updateClientBalanceUseCase()
    );
  }

  static createInvestmentController(): InvestmentController {
    return new InvestmentController(
      UseCaseFactory.createInvestmentUseCase(),
      UseCaseFactory.getPortfolioSummaryUseCase()
    );
  }
}
