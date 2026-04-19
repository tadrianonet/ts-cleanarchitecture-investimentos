import { Client } from '../../domain/entities/client';
import { Investment } from '../../domain/entities/investment';

export interface NotificationService {
  sendInvestmentConfirmation(client: Client, investment: Investment): Promise<void>;
  sendPortfolioUpdate(client: Client, totalValue: number, returnPercentage: number): Promise<void>;
  sendRiskAlert(client: Client, message: string): Promise<void>;
}
