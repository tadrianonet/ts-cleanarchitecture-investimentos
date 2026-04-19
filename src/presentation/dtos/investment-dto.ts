export interface CreateInvestmentDto {
  clientId: string;
  code: string;
  amount: number;
  type: 'ACAO' | 'RENDA_FIXA' | 'FUNDO' | 'CRIPTO' | 'FII';
  expectedReturn?: number;
}

export interface InvestmentResponseDto {
  id: string;
  clientId: string;
  code: string;
  amount: number;
  type: string;
  purchaseDate: string;
  expectedReturn?: number;
}
