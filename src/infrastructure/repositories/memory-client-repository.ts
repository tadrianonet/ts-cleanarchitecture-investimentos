import { Client } from '../../domain/entities/client';
import { ClientRepository } from '../../domain/repositories/client-repository';

export class MemoryClientRepository implements ClientRepository {
  private clients: Map<string, Client> = new Map();

  async save(client: Client): Promise<void> {
    this.clients.set(client.getId(), client);
  }

  async findById(id: string): Promise<Client | null> {
    return this.clients.get(id) || null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    for (const client of this.clients.values()) {
      if (client.getEmail().getValue() === email.toLowerCase()) {
        return client;
      }
    }
    return null;
  }

  async findAll(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async delete(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.clients.has(id);
  }

  clear(): void {
    this.clients.clear();
  }

  size(): number {
    return this.clients.size;
  }
}
