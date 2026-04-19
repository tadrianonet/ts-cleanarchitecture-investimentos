export interface CreateClientDto {
  name: string;
  email: string;
  initialBalance?: number;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
}

export interface ClientResponseDto {
  id: string;
  name: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface UpdateBalanceDto {
  amount: number;
  operation: 'DEPOSIT' | 'WITHDRAW';
}
