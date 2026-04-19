import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function exemploCompleto() {
  try {
    console.log('Iniciando exemplo de uso da API...\n');

    console.log('1. Criando cliente...');
    const clienteResponse = await axios.post(`${API_BASE_URL}/clients`, {
      name: 'Thiago Adriano',
      email: 'thiago.adriano@email.com',
      initialBalance: 50000
    });

    const clienteId = clienteResponse.data.id;
    console.log(`Cliente criado: ${clienteResponse.data.name} (ID: ${clienteId})\n`);

    console.log('2. Fazendo depósito...');
    await axios.put(`${API_BASE_URL}/clients/${clienteId}/balance`, {
      amount: 25000,
      operation: 'DEPOSIT'
    });
    console.log('Depósito de R$ 25.000 realizado\n');

    console.log('3. Criando investimentos...');

    const investimentos = [
      { code: 'PETR4', amount: 15000, type: 'ACAO', expectedReturn: 0.12 },
      { code: 'CDB001', amount: 20000, type: 'RENDA_FIXA', expectedReturn: 0.1 },
      { code: 'HASH11', amount: 10000, type: 'FII', expectedReturn: 0.08 },
      { code: 'BTC', amount: 5000, type: 'CRIPTO', expectedReturn: 0.25 }
    ];

    for (const inv of investimentos) {
      await axios.post(`${API_BASE_URL}/investments`, {
        clientId: clienteId,
        ...inv
      });
      console.log(`Investimento criado: ${inv.code} - R$ ${inv.amount.toLocaleString()}`);
    }

    console.log('\n4. Obtendo resumo do portfólio...');

    const portfolioResponse = await axios.get(
      `${API_BASE_URL}/investments/portfolio/${clienteId}`
    );
    const portfolio = portfolioResponse.data;

    console.log('\nRESUMO DO PORTFÓLIO:');
    console.log(`Cliente: ${portfolio.clientName}`);
    console.log(`Valor Total Investido: R$ ${portfolio.totalInvested.toLocaleString()}`);
    console.log(`Valor Atual: R$ ${portfolio.currentValue.toLocaleString()}`);
    console.log(
      `Retorno: R$ ${portfolio.totalReturn.toLocaleString()} (${portfolio.returnPercentage.toFixed(2)}%)`
    );
    console.log(`Nível de Risco: ${portfolio.riskLevel}`);
    console.log(`Bem Diversificado: ${portfolio.isWellDiversified ? 'Sim' : 'Não'}`);

    console.log('\nDISTRIBUIÇÃO POR TIPO:');
    portfolio.distribution.forEach(
      (dist: { type: string; amount: number; percentage: number; count: number }) => {
        console.log(
          `${dist.type}: R$ ${dist.amount.toLocaleString()} (${dist.percentage.toFixed(1)}%) - ${dist.count} investimento(s)`
        );
      }
    );

    console.log('\nINVESTIMENTOS INDIVIDUAIS:');
    portfolio.investments.forEach(
      (inv: {
        code: string;
        amount: number;
        currentValue: number;
        return: number;
        returnPercentage: number;
      }) => {
        const returnStr = inv.return >= 0 ? `+${inv.return.toLocaleString()}` : inv.return.toLocaleString();
        console.log(
          `${inv.code}: R$ ${inv.amount.toLocaleString()} → R$ ${inv.currentValue.toLocaleString()} (${returnStr} / ${inv.returnPercentage.toFixed(2)}%)`
        );
      }
    );

    console.log('\nExemplo concluído com sucesso!');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro:', error.response?.data || error.message);
    } else {
      console.error('Erro:', error);
    }
  }
}

if (require.main === module) {
  void exemploCompleto();
}
