import { Client } from '../../domain/entities/client';
import { ClientRepository } from '../../domain/repositories/client-repository';
import { IdGenerator } from '../ports/id-generator';

export interface CreateClientRequest {
  name: string;
  email: string;
  initialBalance?: number;
}

export interface CreateClientResponse {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: Date;
}

export class CreateClientUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private idGenerator: IdGenerator
  ) {}

  async execute(request: CreateClientRequest): Promise<CreateClientResponse> {
    const existingClient = await this.clientRepository.findByEmail(request.email);
    if (existingClient) {
      throw new Error('Cliente com este email já existe');
    }

    const id = this.idGenerator.generateForClient();

    const client = Client.create(
      id,
      request.name,
      request.email,
      request.initialBalance || 0
    );

    await this.clientRepository.save(client);

    return {
      id: client.getId(),
      name: client.getName(),
      email: client.getEmail().getValue(),
      balance: client.getBalance().getAmount(),
      createdAt: client.getCreatedAt()
    };
  }
}
