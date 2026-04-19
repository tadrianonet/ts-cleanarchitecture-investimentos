export class InvestmentCode {
  private readonly value: string;

  constructor(code: string) {
    const cleanCode = code.trim().toUpperCase();

    if (!this.isValid(cleanCode)) {
      throw new Error('Código de investimento inválido');
    }

    this.value = cleanCode;
  }

  getValue(): string {
    return this.value;
  }

  private isValid(code: string): boolean {
    const patterns = [
      /^[A-Z]{4}[0-9]{1,2}$/,
      /^[A-Z]{4}[0-9]{2}[BF]$/,
      /^CDB[0-9]{3,6}$/,
      /^LCI[0-9]{3,6}$/,
      /^LCA[0-9]{3,6}$/,
      /^[A-Z]{3,10}$/
    ];

    return patterns.some(pattern => pattern.test(code)) && code.length >= 3 && code.length <= 10;
  }

  equals(other: InvestmentCode): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
