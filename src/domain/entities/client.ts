import { Email } from '../value-objects/email';
import { Money } from '../value-objects/money';

export class Client {
  private constructor(
    private readonly id: string,
    private name: string,
    private email: Email,
    private balance: Money,
    private readonly createdAt: Date
  ) {}

  static create(
    id: string,
    name: string,
    email: string,
    initialBalance: number = 0
  ): Client {
    if (!id || id.trim().length === 0) {
      throw new Error('ID do cliente é obrigatório');
    }

    if (!name || name.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }

    return new Client(
      id.trim(),
      name.trim(),
      new Email(email),
      new Money(initialBalance),
      new Date()
    );
  }

  static restore(
    id: string,
    name: string,
    email: string,
    balance: number,
    createdAt: Date
  ): Client {
    return new Client(
      id,
      name,
      new Email(email),
      new Money(balance),
      createdAt
    );
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getBalance(): Money {
    return this.balance;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  updateName(newName: string): void {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres');
    }
    this.name = newName.trim();
  }

  updateEmail(newEmail: string): void {
    this.email = new Email(newEmail);
  }

  deposit(amount: Money): void {
    this.balance = this.balance.add(amount);
  }

  withdraw(amount: Money): void {
    if (this.balance.isLessThan(amount)) {
      throw new Error('Saldo insuficiente para saque');
    }
    this.balance = this.balance.subtract(amount);
  }

  canInvest(amount: Money): boolean {
    return !this.balance.isLessThan(amount);
  }

  invest(amount: Money): void {
    if (!this.canInvest(amount)) {
      throw new Error('Saldo insuficiente para investimento');
    }
    this.balance = this.balance.subtract(amount);
  }

  receiveReturn(amount: Money): void {
    this.balance = this.balance.add(amount);
  }
}
