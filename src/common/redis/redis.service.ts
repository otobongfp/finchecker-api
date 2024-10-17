import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly redisClient: Redis) {}

  // Set a value (report) as a Base64 string
  async setReport(reportId: string, report: Buffer): Promise<void> {
    const base64Report = report.toString('base64'); // Convert Buffer to Base64 string
    await this.redisClient.set(reportId, base64Report);
  }

  // Get a report and convert it back to Buffer
  async getReport(reportId: string): Promise<Buffer | null> {
    const base64Report = await this.redisClient.get(reportId);
    if (base64Report) {
      return Buffer.from(base64Report, 'base64'); // Convert Base64 string back to Buffer
    }
    return null;
  }

  // Set the status of a report
  async setStatus(reportId: string, status: string): Promise<void> {
    await this.redisClient.set(`status:${reportId}`, status);
  }

  // Get the status of a report
  async getStatus(reportId: string): Promise<string | null> {
    return this.redisClient.get(`status:${reportId}`);
  }

  // Delete a report and its status
  async deleteReport(reportId: string): Promise<void> {
    await this.redisClient.del(reportId); // Delete the report itself
    await this.redisClient.del(`status:${reportId}`); // Delete the associated status
  }

  // Delete a specific key from Redis
  async deleteValue(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
