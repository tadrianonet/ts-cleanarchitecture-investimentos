export interface IdGenerator {
  generate(): string;
  generateForClient(): string;
  generateForInvestment(): string;
}
