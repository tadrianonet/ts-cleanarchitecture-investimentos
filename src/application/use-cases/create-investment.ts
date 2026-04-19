import { Investment, InvestmentType } from '../../domain/entities/investment';
import { ClientRepository } from '../../domain/repositories/client-repository';
import { InvestmentRepository } from '../../domain/repositories/investment-repository';
import { PortfolioRepository } from '../../domain/repositories/portfolio-repository';
import { NotificationService } from '../ports/notification-service';
import { PriceProvider } from '../ports/price-provider';
import { IdGenerator } from '../ports/id-generator';
import { Money } from '../../domain/value-objects/money';
import { Portfolio } from '../../domain/entities/portfolio';

export interface CreateInvestmentRequest {
  clientId: string;
  code: string;
  amount: number;
  type: InvestmentType;
  expectedReturn?: number;
}

export interface CreateInvestmentResponse {
  id: string;
  clientId: string;
  code: string;
  amount: number;
  type: InvestmentType;
  purchaseDate: Date;
  expectedReturn?: number;
}

export class CreateInvestmentUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private investmentRepository: InvestmentRepository,
    private portfolioRepository: PortfolioRepository,
    private notificationService: NotificationService,
    private priceProvider: PriceProvider,
    private idGenerator: IdGenerator
  ) {}

  async execute(request: CreateInvestmentRequest): Promise<CreateInvestmentResponse> {
    const client = await this.clientRepository.findById(request.clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    if (request.type === InvestmentType.STOCK) {
      const isMarketOpen = await this.priceProvider.isMarketOpen();
      if (!isMarketOpen) {
        throw new Error(
          'Mercado fechado. Investimentos em ações só podem ser feitos durante o horário de funcionamento.'
        );
      }
    }

    const investmentAmount = new Money(request.amount);
    if (!client.canInvest(investmentAmount)) {
      throw new Error('Saldo insuficiente para realizar o investimento');
    }

    const id = this.idGenerator.generateForInvestment();

    const investment = Investment.create(
      id,
      request.clientId,
      request.code,
      request.amount,
      request.type,
      request.expectedReturn
    );

    client.invest(investmentAmount);

    await this.clientRepository.save(client);

    await this.investmentRepository.save(investment);

    let portfolio = await this.portfolioRepository.findByClientId(request.clientId);
    if (!portfolio) {
      portfolio = Portfolio.create(request.clientId);
    }
    portfolio.addInvestment(investment);
    await this.portfolioRepository.save(portfolio);

    try {
      await this.notificationService.sendInvestmentConfirmation(client, investment);
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }

    return {
      id: investment.getId(),
      clientId: investment.getClientId(),
      code: investment.getCode().getValue(),
      amount: investment.getAmount().getAmount(),
      type: investment.getType(),
      purchaseDate: investment.getPurchaseDate(),
      expectedReturn: investment.getExpectedReturn()
    };
  }
}
