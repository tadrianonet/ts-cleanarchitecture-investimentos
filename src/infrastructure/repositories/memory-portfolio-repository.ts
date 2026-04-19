import { Portfolio } from '../../domain/entities/portfolio';
import { PortfolioRepository } from '../../domain/repositories/portfolio-repository';

export class MemoryPortfolioRepository implements PortfolioRepository {
  private portfolios: Map<string, Portfolio> = new Map();

  async save(portfolio: Portfolio): Promise<void> {
    this.portfolios.set(portfolio.getClientId(), portfolio);
  }

  async findByClientId(clientId: string): Promise<Portfolio | null> {
    return this.portfolios.get(clientId) || null;
  }

  async delete(clientId: string): Promise<boolean> {
    return this.portfolios.delete(clientId);
  }

  clear(): void {
    this.portfolios.clear();
  }

  size(): number {
    return this.portfolios.size;
  }
}
