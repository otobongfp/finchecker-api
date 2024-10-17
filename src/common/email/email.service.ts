import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create a transporter using SMTP or any other provider
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Example using Gmail, or use SMTP details
      auth: {
        user: process.env.EMAIL_USER, // Set environment variables
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send email with an attachment
  async sendEmailWithAttachment(
    to: string,
    attachment: Buffer,
    filename: string,
  ): Promise<void> {
    try {
      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to, // Recipient email
        subject: 'Your Financial Report',
        text: 'Please find the attached financial report.',
        attachments: [
          {
            filename,
            content: attachment, // The PDF report
          },
        ],
      };

      // Send the email
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
