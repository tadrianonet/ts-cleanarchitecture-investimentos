import { Portfolio } from '../entities/portfolio';

export interface PortfolioRepository {
  save(portfolio: Portfolio): Promise<void>;
  findByClientId(clientId: string): Promise<Portfolio | null>;
  delete(clientId: string): Promise<boolean>;
}
