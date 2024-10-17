import { Injectable } from '@nestjs/common';
import { DocService } from 'common/doc/doc.service';
import { EmailService } from 'common/email/email.service';
import { RabbitMQService } from 'common/rabbitmq/rabbitmq.service';
import { RedisService } from 'common/redis/redis.service';
import { Transaction } from 'common/types/transaction';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportService {
  constructor(
    private readonly redisService: RedisService,
    private readonly rabbitmqService: RabbitMQService,
    private readonly docService: DocService,
    private readonly emailService: EmailService,
  ) {}

  async queueReportGeneration(transactions: Transaction[]): Promise<string> {
    const reportId = this.generateReportId();
    // Set initial status as 'processing'
    await this.redisService.setStatus(reportId, 'processing');

    // Send the transactions to RabbitMQ for processing
    try {
      await this.rabbitmqService.sendToQueue('financial_reports_queue', {
        reportId,
        transactions,
      });
      console.log(`Report queued with ID: ${reportId}`);
    } catch (error) {
      console.error(`Failed to queue report ${reportId}:`, error);
      throw new Error('Failed to queue report for processing');
    }

    return reportId;
  }

  private generateReportId(): string {
    return 'report-' + uuidv4();
  }

  async getReportById(reportId: string): Promise<Buffer | null> {
    return await this.redisService.getReport(reportId);
  }

  async checkReportStatus(reportId: string): Promise<string | null> {
    return await this.redisService.getStatus(reportId);
  }

  async processReport(
    reportId: string,
    transactions: Transaction[],
  ): Promise<void> {
    const analysisResult = await this.analyzeTransactions(transactions);
    const pdfReport = await this.docService.generatePdf(analysisResult);
    await this.redisService.setReport(reportId, pdfReport);
    await this.redisService.setStatus(reportId, 'completed');
  }

  async sendReportByEmail(reportId: string, email: string): Promise<void> {
    const report = await this.getReportById(reportId);

    if (!report) {
      throw new Error('Report not ready');
    }

    //Send email with the report attached
    await this.emailService.sendEmailWithAttachment(
      email,
      report,
      `financial-report-${reportId}.pdf`,
    );
  }

  // Simulate analysis of transactions
  private async analyzeTransactions(transactions: any[]): Promise<any> {
    // Add AI/Mathematical analysis logic here
    return {
      status: 'Good',
      creditScore: 750,
      advice:
        'Your financial status is healthy. Continue to maintain your balance.',
    };
  }
}
