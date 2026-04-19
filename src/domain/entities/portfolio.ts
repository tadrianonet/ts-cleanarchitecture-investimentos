import { Investment } from './investment';
import { Money } from '../value-objects/money';

export interface PortfolioDistribution {
  type: string;
  amount: Money;
  percentage: number;
  count: number;
}

export class Portfolio {
  private constructor(
    private readonly clientId: string,
    private investments: Investment[]
  ) {}

  static create(clientId: string): Portfolio {
    if (!clientId || clientId.trim().length === 0) {
      throw new Error('ID do cliente é obrigatório');
    }

    return new Portfolio(clientId.trim(), []);
  }

  static restore(clientId: string, investments: Investment[]): Portfolio {
    return new Portfolio(clientId, investments);
  }

  getClientId(): string {
    return this.clientId;
  }

  getInvestments(): Investment[] {
    return [...this.investments];
  }

  addInvestment(investment: Investment): void {
    if (investment.getClientId() !== this.clientId) {
      throw new Error('Investimento não pertence a este cliente');
    }

    this.investments.push(investment);
  }

  removeInvestment(investmentId: string): boolean {
    const index = this.investments.findIndex(inv => inv.getId() === investmentId);

    if (index === -1) {
      return false;
    }

    this.investments.splice(index, 1);
    return true;
  }

  getTotalValue(): Money {
    if (this.investments.length === 0) {
      return new Money(0);
    }

    return this.investments.reduce(
      (total, investment) => total.add(investment.getAmount()),
      new Money(0)
    );
  }

  getCurrentValue(priceProvider: (code: string) => number): Money {
    if (this.investments.length === 0) {
      return new Money(0);
    }

    return this.investments.reduce((total, investment) => {
      const currentPrice = priceProvider(investment.getCode().getValue());
      const currentValue = investment.calculateCurrentValue(currentPrice);
      return total.add(currentValue);
    }, new Money(0));
  }

  getTotalReturn(priceProvider: (code: string) => number): Money {
    const currentValue = this.getCurrentValue(priceProvider);
    const totalInvested = this.getTotalValue();
    return currentValue.subtract(totalInvested);
  }

  getTotalReturnPercentage(priceProvider: (code: string) => number): number {
    const totalInvested = this.getTotalValue();

    if (totalInvested.getAmount() === 0) {
      return 0;
    }

    const totalReturn = this.getTotalReturn(priceProvider);
    return (totalReturn.getAmount() / totalInvested.getAmount()) * 100;
  }

  getDistribution(): PortfolioDistribution[] {
    const totalValue = this.getTotalValue();

    if (totalValue.getAmount() === 0) {
      return [];
    }

    const distributionMap = new Map<string, { amount: Money; count: number }>();

    for (const investment of this.investments) {
      const type = investment.getType();
      const existing = distributionMap.get(type);

      if (existing) {
        distributionMap.set(type, {
          amount: existing.amount.add(investment.getAmount()),
          count: existing.count + 1
        });
      } else {
        distributionMap.set(type, {
          amount: investment.getAmount(),
          count: 1
        });
      }
    }

    return Array.from(distributionMap.entries()).map(([type, data]) => ({
      type,
      amount: data.amount,
      percentage: (data.amount.getAmount() / totalValue.getAmount()) * 100,
      count: data.count
    }));
  }

  getRiskyInvestments(): Investment[] {
    return this.investments.filter(investment => investment.isRisky());
  }

  getConservativeInvestments(): Investment[] {
    return this.investments.filter(investment => investment.isConservative());
  }

  getInvestmentsByType(type: string): Investment[] {
    return this.investments.filter(investment => investment.getType() === type);
  }

  isWellDiversified(): boolean {
    const distribution = this.getDistribution();

    return distribution.every(dist => dist.percentage <= 60);
  }

  getRiskLevel(): 'BAIXO' | 'MEDIO' | 'ALTO' {
    const distribution = this.getDistribution();
    const riskyPercentage = distribution
      .filter(dist => dist.type === 'ACAO' || dist.type === 'CRIPTO')
      .reduce((sum, dist) => sum + dist.percentage, 0);

    if (riskyPercentage <= 30) return 'BAIXO';
    if (riskyPercentage <= 70) return 'MEDIO';
    return 'ALTO';
  }
}
