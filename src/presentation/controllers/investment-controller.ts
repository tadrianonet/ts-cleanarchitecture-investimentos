import { Request, Response } from 'express';
import { CreateInvestmentUseCase } from '../../application/use-cases/create-investment';
import { GetPortfolioSummaryUseCase } from '../../application/use-cases/get-portfolio-summary';
import { CreateInvestmentDto, InvestmentResponseDto } from '../dtos/investment-dto';
import { InvestmentType } from '../../domain/entities/investment';

export class InvestmentController {
  constructor(
    private createInvestmentUseCase: CreateInvestmentUseCase,
    private getPortfolioSummaryUseCase: GetPortfolioSummaryUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateInvestmentDto = req.body;

      if (!dto.clientId || !dto.code || !dto.amount || !dto.type) {
        res.status(400).json({
          error: 'ClientId, código, valor e tipo são obrigatórios'
        });
        return;
      }

      if (dto.amount <= 0) {
        res.status(400).json({
          error: 'Valor do investimento deve ser positivo'
        });
        return;
      }

      if (!Object.values(InvestmentType).includes(dto.type as InvestmentType)) {
        res.status(400).json({
          error: 'Tipo de investimento inválido'
        });
        return;
      }

      const result = await this.createInvestmentUseCase.execute({
        clientId: dto.clientId,
        code: dto.code,
        amount: dto.amount,
        type: dto.type as InvestmentType,
        expectedReturn: dto.expectedReturn
      });

      const response: InvestmentResponseDto = {
        id: result.id,
        clientId: result.clientId,
        code: result.code,
        amount: result.amount,
        type: result.type,
        purchaseDate: result.purchaseDate.toISOString(),
        expectedReturn: result.expectedReturn
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro ao criar investimento:', error);

      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({ error: error.message });
          return;
        }

        if (error.message.includes('insuficiente') || error.message.includes('fechado')) {
          res.status(400).json({ error: error.message });
          return;
        }

        if (error.message.includes('inválido')) {
          res.status(400).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async getPortfolioSummary(req: Request, res: Response): Promise<void> {
    try {
      const clientId = req.params.clientId;

      if (!clientId) {
        res.status(400).json({
          error: 'ID do cliente é obrigatório'
        });
        return;
      }

      const result = await this.getPortfolioSummaryUseCase.execute({ clientId });

      res.json(result);
    } catch (error) {
      console.error('Erro ao obter resumo do portfólio:', error);

      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          res.status(404).json({ error: error.message });
          return;
        }
      }

      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}
