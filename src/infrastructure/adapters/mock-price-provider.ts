import { PriceProvider } from '../../application/ports/price-provider';

export class MockPriceProvider implements PriceProvider {
  private prices: Map<string, number> = new Map([
    ['PETR4', 0.05],
    ['VALE3', -0.02],
    ['ITUB4', 0.03],
    ['BBAS3', 0.01],
    ['CDB001', 0.12],
    ['LCI001', 0.1],
    ['BTC', 0.15],
    ['ETH', 0.08],
    ['HASH11', 0.06]
  ]);

  async getCurrentPrice(code: string): Promise<number> {
    await this.delay(process.env.NODE_ENV === 'test' ? 0 : 100);

    const price = this.prices.get(code);
    if (price === undefined) {
      throw new Error(`Preço não encontrado para o código: ${code}`);
    }

    if (process.env.NODE_ENV === 'test') {
      return price;
    }

    const volatility = (Math.random() - 0.5) * 0.02;
    return price + volatility;
  }

  async getPriceHistory(code: string, days: number): Promise<Array<{ date: Date; price: number }>> {
    await this.delay(200);

    const basePrice = this.prices.get(code) || 0;
    const history: Array<{ date: Date; price: number }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const variation = (Math.random() - 0.5) * 0.1;
      const price = basePrice + variation;

      history.push({ date, price });
    }

    return history;
  }

  async isMarketOpen(): Promise<boolean> {
    await this.delay(50);

    if (process.env.NODE_ENV === 'test') {
      return true;
    }

    if (process.env.MOCK_MARKET_ALWAYS_OPEN === '1' || process.env.MOCK_MARKET_ALWAYS_OPEN === 'true') {
      return true;
    }

    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isBusinessHour = hour >= 10 && hour < 17;

    return isWeekday && isBusinessHour;
  }

  updatePrice(code: string, price: number): void {
    this.prices.set(code, price);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
