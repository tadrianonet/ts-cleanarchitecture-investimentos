import {
  CreateInvestmentUseCase,
  CreateInvestmentRequest
} from '../../../application/use-cases/create-investment';
import { Client } from '../../../domain/entities/client';
import { InvestmentType } from '../../../domain/entities/investment';
import { ClientRepository } from '../../../domain/repositories/client-repository';
import { InvestmentRepository } from '../../../domain/repositories/investment-repository';
import { PortfolioRepository } from '../../../domain/repositories/portfolio-repository';
import { NotificationService } from '../../../application/ports/notification-service';
import { PriceProvider } from '../../../application/ports/price-provider';
import { IdGenerator } from '../../../application/ports/id-generator';

const MARKET_CLOSED_MESSAGE =
  'Mercado fechado. Investimentos em ações só podem ser feitos durante o horário de funcionamento.';

function buildClient(initialBalance = 50_000): Client {
  return Client.create('client_1', 'Thiago Adriano', 'thiago@email.com', initialBalance);
}

function buildRequest(
  overrides: Partial<CreateInvestmentRequest> = {}
): CreateInvestmentRequest {
  return {
    clientId: 'client_1',
    code: 'PETR4',
    amount: 1_000,
    type: InvestmentType.STOCK,
    expectedReturn: 0.1,
    ...overrides
  };
}

interface Mocks {
  clientRepository: jest.Mocked<ClientRepository>;
  investmentRepository: jest.Mocked<InvestmentRepository>;
  portfolioRepository: jest.Mocked<PortfolioRepository>;
  notificationService: jest.Mocked<NotificationService>;
  priceProvider: jest.Mocked<PriceProvider>;
  idGenerator: jest.Mocked<IdGenerator>;
}

function buildMocks(client: Client, isMarketOpen: boolean): Mocks {
  return {
    clientRepository: {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(client),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn()
    } as unknown as jest.Mocked<ClientRepository>,
    investmentRepository: {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByClientId: jest.fn(),
      findByType: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      countByClientId: jest.fn()
    } as unknown as jest.Mocked<InvestmentRepository>,
    portfolioRepository: {
      save: jest.fn().mockResolvedValue(undefined),
      findByClientId: jest.fn().mockResolvedValue(null),
      delete: jest.fn()
    } as unknown as jest.Mocked<PortfolioRepository>,
    notificationService: {
      sendInvestmentConfirmation: jest.fn().mockResolvedValue(undefined),
      sendPortfolioUpdate: jest.fn(),
      sendRiskAlert: jest.fn()
    } as unknown as jest.Mocked<NotificationService>,
    priceProvider: {
      getCurrentPrice: jest.fn(),
      getPriceHistory: jest.fn(),
      isMarketOpen: jest.fn().mockResolvedValue(isMarketOpen)
    } as unknown as jest.Mocked<PriceProvider>,
    idGenerator: {
      generate: jest.fn().mockReturnValue('id_generic'),
      generateForClient: jest.fn().mockReturnValue('client_generic'),
      generateForInvestment: jest.fn().mockReturnValue('investment_1')
    } as unknown as jest.Mocked<IdGenerator>
  };
}

function buildUseCase(mocks: Mocks): CreateInvestmentUseCase {
  return new CreateInvestmentUseCase(
    mocks.clientRepository,
    mocks.investmentRepository,
    mocks.portfolioRepository,
    mocks.notificationService,
    mocks.priceProvider,
    mocks.idGenerator
  );
}

describe('CreateInvestmentUseCase - validação de mercado', () => {
  describe('quando o tipo é ACAO e o mercado está fechado', () => {
    test('deve lançar erro com a mensagem de mercado fechado', async () => {
      const mocks = buildMocks(buildClient(), false);
      const useCase = buildUseCase(mocks);

      await expect(useCase.execute(buildRequest())).rejects.toThrow(MARKET_CLOSED_MESSAGE);

      expect(mocks.priceProvider.isMarketOpen).toHaveBeenCalledTimes(1);
      expect(mocks.investmentRepository.save).not.toHaveBeenCalled();
      expect(mocks.portfolioRepository.save).not.toHaveBeenCalled();
      expect(mocks.clientRepository.save).not.toHaveBeenCalled();
      expect(mocks.notificationService.sendInvestmentConfirmation).not.toHaveBeenCalled();
    });
  });

  describe('quando o tipo é ACAO e o mercado está aberto', () => {
    test('deve criar o investimento com sucesso', async () => {
      const mocks = buildMocks(buildClient(), true);
      const useCase = buildUseCase(mocks);

      const response = await useCase.execute(buildRequest({ amount: 5_000 }));

      expect(mocks.priceProvider.isMarketOpen).toHaveBeenCalledTimes(1);
      expect(mocks.investmentRepository.save).toHaveBeenCalledTimes(1);
      expect(mocks.portfolioRepository.save).toHaveBeenCalledTimes(1);
      expect(mocks.clientRepository.save).toHaveBeenCalledTimes(1);
      expect(mocks.notificationService.sendInvestmentConfirmation).toHaveBeenCalledTimes(1);

      expect(response).toMatchObject({
        id: 'investment_1',
        clientId: 'client_1',
        code: 'PETR4',
        amount: 5_000,
        type: InvestmentType.STOCK,
        expectedReturn: 0.1
      });
      expect(response.purchaseDate).toBeInstanceOf(Date);
    });
  });

  describe('quando o tipo NÃO é ACAO', () => {
    test.each([
      [InvestmentType.FIXED_INCOME, 'CDB001'],
      [InvestmentType.REAL_ESTATE, 'HASH11'],
      [InvestmentType.CRYPTO, 'BTC'],
      [InvestmentType.FUND, 'FUND11']
    ])(
      'não deve consultar o mercado nem bloquear a criação para %s',
      async (type, code) => {
        const mocks = buildMocks(buildClient(), false);
        const useCase = buildUseCase(mocks);

        await expect(
          useCase.execute(buildRequest({ type, code, amount: 2_000 }))
        ).resolves.toMatchObject({ type, code });

        expect(mocks.priceProvider.isMarketOpen).not.toHaveBeenCalled();
        expect(mocks.investmentRepository.save).toHaveBeenCalledTimes(1);
        expect(mocks.clientRepository.save).toHaveBeenCalledTimes(1);
        expect(mocks.portfolioRepository.save).toHaveBeenCalledTimes(1);
      }
    );
  });
});
