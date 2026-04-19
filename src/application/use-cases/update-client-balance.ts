import { ClientRepository } from '../../domain/repositories/client-repository';
import { Money } from '../../domain/value-objects/money';

export interface UpdateClientBalanceRequest {
  clientId: string;
  amount: number;
  operation: 'DEPOSIT' | 'WITHDRAW';
}

export interface UpdateClientBalanceResponse {
  clientId: string;
  previousBalance: number;
  newBalance: number;
  operation: string;
  amount: number;
}

export class UpdateClientBalanceUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(request: UpdateClientBalanceRequest): Promise<UpdateClientBalanceResponse> {
    const client = await this.clientRepository.findById(request.clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const previousBalance = client.getBalance().getAmount();

    const amount = new Money(request.amount);

    if (request.operation === 'DEPOSIT') {
      client.deposit(amount);
    } else if (request.operation === 'WITHDRAW') {
      client.withdraw(amount);
    } else {
      throw new Error('Operação inválida. Use DEPOSIT ou WITHDRAW');
    }

    await this.clientRepository.save(client);

    return {
      clientId: client.getId(),
      previousBalance,
      newBalance: client.getBalance().getAmount(),
      operation: request.operation,
      amount: request.amount
    };
  }
}
