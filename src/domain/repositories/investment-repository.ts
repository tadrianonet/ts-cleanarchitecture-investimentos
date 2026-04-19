import { Investment } from '../entities/investment';

export interface InvestmentRepository {
  save(investment: Investment): Promise<void>;
  findById(id: string): Promise<Investment | null>;
  findByClientId(clientId: string): Promise<Investment[]>;
  findByType(type: string): Promise<Investment[]>;
  findAll(): Promise<Investment[]>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  countByClientId(clientId: string): Promise<number>;
}
