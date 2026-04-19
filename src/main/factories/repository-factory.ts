import { ClientRepository } from '../../domain/repositories/client-repository';
import { InvestmentRepository } from '../../domain/repositories/investment-repository';
import { PortfolioRepository } from '../../domain/repositories/portfolio-repository';
import { MemoryClientRepository } from '../../infrastructure/repositories/memory-client-repository';
import { MemoryInvestmentRepository } from '../../infrastructure/repositories/memory-investment-repository';
import { MemoryPortfolioRepository } from '../../infrastructure/repositories/memory-portfolio-repository';

export class RepositoryFactory {
  private static clientRepository: ClientRepository;
  private static investmentRepository: InvestmentRepository;
  private static portfolioRepository: PortfolioRepository;

  static getClientRepository(): ClientRepository {
    if (!this.clientRepository) {
      this.clientRepository = new MemoryClientRepository();
    }
    return this.clientRepository;
  }

  static getInvestmentRepository(): InvestmentRepository {
    if (!this.investmentRepository) {
      this.investmentRepository = new MemoryInvestmentRepository();
    }
    return this.investmentRepository;
  }

  static getPortfolioRepository(): PortfolioRepository {
    if (!this.portfolioRepository) {
      this.portfolioRepository = new MemoryPortfolioRepository();
    }
    return this.portfolioRepository;
  }
}
