import { Request, Response } from 'express';
import { CreateClientUseCase } from '../../application/use-cases/create-client';
import { UpdateClientBalanceUseCase } from '../../application/use-cases/update-client-balance';
import { CreateClientDto, UpdateBalanceDto, ClientResponseDto } from '../dtos/client-dto';

export class ClientController {
  constructor(
    private createClientUseCase: CreateClientUseCase,
    private updateClientBalanceUseCase: UpdateClientBalanceUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateClientDto = req.body;

      if (!dto.name || !dto.email) {
        res.status(400).json({
          error: 'Nome e email são obrigatórios'
        });
        return;
      }

      if (dto.initialBalance !== undefined && dto.initialBalance < 0) {
        res.status(400).json({
          error: 'Saldo inicial não pode ser negativo'
        });
        return;
      }

      const result = await this.createClientUseCase.execute({
        name: dto.name,
        email: dto.email,
        initialBalance: dto.initialBalance
      });

      const response: ClientResponseDto = {
        id: result.id,
        name: result.name,
        email: result.email,
        balance: result.balance,
        createdAt: result.createdAt.toISOString()
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);

      if (error instanceof Error) {
        if (error.message.includes('já existe')) {
          res.status(409).json({ error: error.message });
          return;
        }

        if (error.message.includes('inválido') || error.message.includes('obrigatório')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async updateBalance(req: Request, res: Response): Promise<void> {
    try {
      const clientId = req.params.id;
      const dto: UpdateBalanceDto = req.body;

      if (!clientId) {
        res.status(400).json({
          error: 'ID do cliente é obrigatório'
        });
        return;
      }

      if (!dto.amount || dto.amount <= 0) {
        res.status(400).json({
          error: 'Valor deve ser positivo'
        });
        return;
      }

      if (!['DEPOSIT', 'WITHDRAW'].includes(dto.operation)) {
        res.status(400).json({
          error: 'Operação deve ser DEPOSIT ou WITHDRAW'
        });
        return;
      }

      const result = await this.updateClientBalanceUseCase.execute({
        clientId,
        amount: dto.amount,
        operation: dto.operation
      });

      res.json({
        clientId: result.clientId,
        previousBalance: result.previousBalance,
        newBalance: result.newBalance,
        operation: result.operation,
        amount: result.amount
      });
    } catch (error) {
      console.error('Erro ao atualizar saldo:', error);

      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({ error: error.message });
          return;
        }

        if (error.message.includes('insuficiente')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
