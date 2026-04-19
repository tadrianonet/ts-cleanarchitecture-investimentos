import { Investment } from '../../domain/entities/investment';
import { InvestmentRepository } from '../../domain/repositories/investment-repository';

export class MemoryInvestmentRepository implements InvestmentRepository {
  private investments: Map<string, Investment> = new Map();

  async save(investment: Investment): Promise<void> {
    this.investments.set(investment.getId(), investment);
  }

  async findById(id: string): Promise<Investment | null> {
    return this.investments.get(id) || null;
  }

  async findByClientId(clientId: string): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      investment => investment.getClientId() === clientId
    );
  }

  async findByType(type: string): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      investment => investment.getType() === type
    );
  }

  async findAll(): Promise<Investment[]> {
    return Array.from(this.investments.values());
  }

  async delete(id: string): Promise<boolean> {
    return this.investments.delete(id);
  }

  async count(): Promise<number> {
    return this.investments.size;
  }

  async countByClientId(clientId: string): Promise<number> {
    return (await this.findByClientId(clientId)).length;
  }

  clear(): void {
    this.investments.clear();
  }
}
