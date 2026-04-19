import { CreateClientUseCase } from '../../application/use-cases/create-client';
import { CreateInvestmentUseCase } from '../../application/use-cases/create-investment';
import { GetPortfolioSummaryUseCase } from '../../application/use-cases/get-portfolio-summary';
import { UpdateClientBalanceUseCase } from '../../application/use-cases/update-client-balance';
import { RepositoryFactory } from './repository-factory';
import { ServiceFactory } from './service-factory';

export class UseCaseFactory {
  static createClientUseCase(): CreateClientUseCase {
    return new CreateClientUseCase(
      RepositoryFactory.getClientRepository(),
      ServiceFactory.getIdGenerator()
    );
  }

  static createInvestmentUseCase(): CreateInvestmentUseCase {
    return new CreateInvestmentUseCase(
      RepositoryFactory.getClientRepository(),
      RepositoryFactory.getInvestmentRepository(),
      RepositoryFactory.getPortfolioRepository(),
      ServiceFactory.getNotificationService(),
      ServiceFactory.getPriceProvider(),
      ServiceFactory.getIdGenerator()
    );
  }

  static getPortfolioSummaryUseCase(): GetPortfolioSummaryUseCase {
    return new GetPortfolioSummaryUseCase(
      RepositoryFactory.getClientRepository(),
      RepositoryFactory.getPortfolioRepository(),
      ServiceFactory.getPriceProvider()
    );
  }

  static updateClientBalanceUseCase(): UpdateClientBalanceUseCase {
    return new UpdateClientBalanceUseCase(RepositoryFactory.getClientRepository());
  }
}
