export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'BRL') {
    if (amount < 0) {
      throw new Error('Valor monetário não pode ser negativo');
    }

    if (!Number.isFinite(amount)) {
      throw new Error('Valor monetário deve ser um número válido');
    }

    this.amount = Math.round(amount * 100) / 100;
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.validateSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Não é possível dividir por zero');
    }
    return new Money(this.amount / divisor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    this.validateSameCurrency(other);
    return this.amount < other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  private validateSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Não é possível operar com moedas diferentes: ${this.currency} e ${other.currency}`);
    }
  }

  toString(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this.currency
    }).format(this.amount);
  }
}
