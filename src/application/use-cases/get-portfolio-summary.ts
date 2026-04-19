import { ClientRepository } from '../../domain/repositories/client-repository';
import { PortfolioRepository } from '../../domain/repositories/portfolio-repository';
import { PriceProvider } from '../ports/price-provider';

export interface PortfolioSummaryRequest {
  clientId: string;
}

export interface PortfolioSummaryResponse {
  clientId: string;
  clientName: string;
  totalInvested: number;
  currentValue: number;
  totalReturn: number;
  returnPercentage: number;
  riskLevel: string;
  isWellDiversified: boolean;
  distribution: Array<{
    type: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  investments: Array<{
    id: string;
    code: string;
    amount: number;
    currentValue: number;
    return: number;
    returnPercentage: number;
    type: string;
    purchaseDate: Date;
  }>;
}

export class GetPortfolioSummaryUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private portfolioRepository: PortfolioRepository,
    private priceProvider: PriceProvider
  ) {}

  async execute(request: PortfolioSummaryRequest): Promise<PortfolioSummaryResponse> {
    const client = await this.clientRepository.findById(request.clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const portfolio = await this.portfolioRepository.findByClientId(request.clientId);
    if (!portfolio) {
      throw new Error('Portfólio não encontrado');
    }

    const cache: Record<string, number> = {};
    for (const investment of portfolio.getInvestments()) {
      const code = investment.getCode().getValue();
      if (cache[code] === undefined) {
        cache[code] = await this.priceProvider.getCurrentPrice(code);
      }
    }

    const priceProvider = (code: string) => cache[code] ?? 0;

    const totalInvested = portfolio.getTotalValue();
    const currentValue = portfolio.getCurrentValue(priceProvider);
    const totalReturn = portfolio.getTotalReturn(priceProvider);
    const returnPercentage = portfolio.getTotalReturnPercentage(priceProvider);

    const distribution = portfolio.getDistribution();

    const investments = portfolio.getInvestments().map(investment => {
      const currentPrice = priceProvider(investment.getCode().getValue());
      const investmentCurrentValue = investment.calculateCurrentValue(currentPrice);
      const investmentReturn = investment.calculateReturn(currentPrice);
      const investmentReturnPercentage = investment.calculateReturnPercentage(currentPrice);

      return {
        id: investment.getId(),
        code: investment.getCode().getValue(),
        amount: investment.getAmount().getAmount(),
        currentValue: investmentCurrentValue.getAmount(),
        return: investmentReturn.getAmount(),
        returnPercentage: investmentReturnPercentage,
        type: investment.getType(),
        purchaseDate: investment.getPurchaseDate()
      };
    });

    return {
      clientId: client.getId(),
      clientName: client.getName(),
      totalInvested: totalInvested.getAmount(),
      currentValue: currentValue.getAmount(),
      totalReturn: totalReturn.getAmount(),
      returnPercentage,
      riskLevel: portfolio.getRiskLevel(),
      isWellDiversified: portfolio.isWellDiversified(),
      distribution: distribution.map(dist => ({
        type: dist.type,
        amount: dist.amount.getAmount(),
        percentage: dist.percentage,
        count: dist.count
      })),
      investments
    };
  }
}
