import { IdGenerator } from '../../application/ports/id-generator';
import { NotificationService } from '../../application/ports/notification-service';
import { PriceProvider } from '../../application/ports/price-provider';
import { UuidIdGenerator } from '../../infrastructure/adapters/uuid-id-generator';
import { ConsoleNotificationService } from '../../infrastructure/adapters/console-notification-service';
import { MockPriceProvider } from '../../infrastructure/adapters/mock-price-provider';

export class ServiceFactory {
  private static idGenerator: IdGenerator;
  private static notificationService: NotificationService;
  private static priceProvider: PriceProvider;

  static getIdGenerator(): IdGenerator {
    if (!this.idGenerator) {
      this.idGenerator = new UuidIdGenerator();
    }
    return this.idGenerator;
  }

  static getNotificationService(): NotificationService {
    if (!this.notificationService) {
      this.notificationService = new ConsoleNotificationService();
    }
    return this.notificationService;
  }

  static getPriceProvider(): PriceProvider {
    if (!this.priceProvider) {
      this.priceProvider = new MockPriceProvider();
    }
    return this.priceProvider;
  }
}
