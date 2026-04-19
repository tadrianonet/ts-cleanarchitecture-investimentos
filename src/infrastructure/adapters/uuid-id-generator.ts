import { IdGenerator } from '../../application/ports/id-generator';
import { randomUUID } from 'crypto';

export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }

  generateForClient(): string {
    return `client_${randomUUID()}`;
  }

  generateForInvestment(): string {
    return `investment_${randomUUID()}`;
  }
}
