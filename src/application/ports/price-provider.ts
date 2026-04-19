export interface PriceProvider {
  getCurrentPrice(code: string): Promise<number>;
  getPriceHistory(code: string, days: number): Promise<Array<{ date: Date; price: number }>>;
  isMarketOpen(): Promise<boolean>;
}
