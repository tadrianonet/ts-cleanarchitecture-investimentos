import { NotificationService } from '../../application/ports/notification-service';
import { Client } from '../../domain/entities/client';
import { Investment } from '../../domain/entities/investment';

export class ConsoleNotificationService implements NotificationService {
  async sendInvestmentConfirmation(client: Client, investment: Investment): Promise<void> {
    console.log(`
NOTIFICAÇÃO DE INVESTIMENTO
Para: ${client.getEmail().getValue()}
Cliente: ${client.getName()}

Seu investimento foi realizado com sucesso!
Código: ${investment.getCode().getValue()}
Valor: ${investment.getAmount().toString()}
Tipo: ${investment.getType()}
Data: ${investment.getPurchaseDate().toLocaleDateString('pt-BR')}

Obrigado por confiar em nossos serviços!
    `);
  }

  async sendPortfolioUpdate(
    client: Client,
    totalValue: number,
    returnPercentage: number
  ): Promise<void> {
    console.log(`
ATUALIZAÇÃO DE PORTFÓLIO
Para: ${client.getEmail().getValue()}
Cliente: ${client.getName()}

Valor total do portfólio: R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Rentabilidade: ${returnPercentage.toFixed(2)}%

Acesse nossa plataforma para mais detalhes.
    `);
  }

  async sendRiskAlert(client: Client, message: string): Promise<void> {
    console.log(`
ALERTA DE RISCO
Para: ${client.getEmail().getValue()}
Cliente: ${client.getName()}

${message}

Recomendamos revisar sua estratégia de investimento.
    `);
  }
}
