import { Client } from '../entities/client';

export interface ClientRepository {
  save(client: Client): Promise<void>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findAll(): Promise<Client[]>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
