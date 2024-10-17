import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
  ) {}

  // Method to send messages to the queue
  async sendToQueue(pattern: string, data: any): Promise<void> {
    try {
      await this.client.emit(pattern, data).toPromise();
      console.log(`Message emitted to queue with pattern: ${pattern}`);
    } catch (error) {
      console.error(`Failed to emit message to queue: ${error.message}`);
    }
  }

  // Method to publish messages (request-response pattern)
  async publishToQueue(pattern: string, data: any): Promise<any> {
    try {
      const result = await this.client.send(pattern, data).toPromise();
      console.log(`Message published to queue with pattern: ${pattern}`);
      return result;
    } catch (error) {
      console.error(`Failed to publish message to queue: ${error.message}`);
      throw error;
    }
  }
}
