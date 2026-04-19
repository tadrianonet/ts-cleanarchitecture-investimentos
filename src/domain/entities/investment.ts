import { InvestmentCode } from '../value-objects/investment-code';
import { Money } from '../value-objects/money';

export enum InvestmentType {
  STOCK = 'ACAO',
  FIXED_INCOME = 'RENDA_FIXA',
  FUND = 'FUNDO',
  CRYPTO = 'CRIPTO',
  REAL_ESTATE = 'FII'
}

export class Investment {
  private constructor(
    private readonly id: string,
    private readonly clientId: string,
    private readonly code: InvestmentCode,
    private readonly amount: Money,
    private readonly type: InvestmentType,
    private readonly purchaseDate: Date,
    private expectedReturn?: number
  ) {}

  static create(
    id: string,
    clientId: string,
    code: string,
    amount: number,
    type: InvestmentType,
    expectedReturn?: number
  ): Investment {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do investimento é obrigatório');
    }

    if (!clientId || clientId.trim().length === 0) {
      throw new Error('ID do cliente é obrigatório');
    }

    if (amount <= 0) {
      throw new Error('Valor do investimento deve ser positivo');
    }

    if (expectedReturn !== undefined && (expectedReturn < -1 || expectedReturn > 10)) {
      throw new Error('Rentabilidade esperada deve estar entre -100% e 1000%');
    }

    return new Investment(
      id.trim(),
      clientId.trim(),
      new InvestmentCode(code),
      new Money(amount),
      type,
      new Date(),
      expectedReturn
    );
  }

  static restore(
    id: string,
    clientId: string,
    code: string,
    amount: number,
    type: InvestmentType,
    purchaseDate: Date,
    expectedReturn?: number
  ): Investment {
    return new Investment(
      id,
      clientId,
      new InvestmentCode(code),
      new Money(amount),
      type,
      purchaseDate,
      expectedReturn
    );
  }

  getId(): string {
    return this.id;
  }

  getClientId(): string {
    return this.clientId;
  }

  getCode(): InvestmentCode {
    return this.code;
  }

  getAmount(): Money {
    return this.amount;
  }

  getType(): InvestmentType {
    return this.type;
  }

  getPurchaseDate(): Date {
    return this.purchaseDate;
  }

  getExpectedReturn(): number | undefined {
    return this.expectedReturn;
  }

  calculateCurrentValue(currentPrice: number): Money {
    if (currentPrice < 0) {
      throw new Error('Preço atual não pode ser negativo');
    }

    if (this.type === InvestmentType.STOCK) {
      const variation = currentPrice;
      return this.amount.multiply(1 + variation);
    }

    if (this.type === InvestmentType.FIXED_INCOME && this.expectedReturn) {
      const daysSincePurchase = this.getDaysSincePurchase();
      const dailyReturn = this.expectedReturn / 365;
      return this.amount.multiply(1 + dailyReturn * daysSincePurchase);
    }

    return this.amount;
  }

  calculateReturn(currentPrice: number): Money {
    const currentValue = this.calculateCurrentValue(currentPrice);
    return currentValue.subtract(this.amount);
  }

  calculateReturnPercentage(currentPrice: number): number {
    const returnAmount = this.calculateReturn(currentPrice);
    return (returnAmount.getAmount() / this.amount.getAmount()) * 100;
  }

  private getDaysSincePurchase(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.purchaseDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isRisky(): boolean {
    return this.type === InvestmentType.STOCK || this.type === InvestmentType.CRYPTO;
  }

  isConservative(): boolean {
    return this.type === InvestmentType.FIXED_INCOME;
  }
}
