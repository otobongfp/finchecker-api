import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { RequestForm } from 'common/types/requestForm';
import { ReportService } from './report.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  //send report
  @Post()
  @ApiOperation({ summary: 'Queue report generation' })
  @ApiBody({
    description: 'Request body for generating a report',
    schema: {
      type: 'object',
      properties: {
        transactions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', format: 'date', example: '2023-09-12' },
              type: {
                type: 'string',
                enum: ['debit', 'credit'],
                example: 'debit',
              },
              amount: { type: 'string', example: '100.00' },
              balance: { type: 'string', example: '500.00' },
              source: { type: 'string', example: 'bank' },
            },
          },
        },
        email: { type: 'string', example: 'client@example.com' },
        options: {
          type: 'object',
          properties: {
            sendEmail: { type: 'boolean', example: true },
            downloadPdf: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Report generation initiated',
  })
  async generateReport(@Body() requestData: RequestForm, @Res() res: Response) {
    const { transactions, email, options } = requestData;

    const reportId =
      await this.reportService.queueReportGeneration(transactions);

    // if (options?.sendEmail && email) {
    //   await this.reportService.sendReportByEmail(reportId, email);
    // }

    res.status(HttpStatus.ACCEPTED).json({
      message: `Your report ${reportId} is being generated.`,
      reportId,
    });
  }

  @Get(':reportId/status')
  @ApiOperation({ summary: 'Check the status of a report' })
  @ApiParam({ name: 'reportId', description: 'ID of the report' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Report status retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Report not found or still processing',
  })
  async checkReportStatus(
    @Param('reportId') reportId: string,
    @Res() res: Response,
  ) {
    const status = await this.reportService.checkReportStatus(reportId);

    if (!status) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Report not found or still processing.' });
    }

    res.status(HttpStatus.OK).json({
      reportId,
      status,
    });
  }

  // Endpoint to download the completed report
  @Get(':reportId/download')
  @ApiOperation({ summary: 'Download the completed report' })
  @ApiParam({ name: 'reportId', description: 'ID of the report' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Report downloaded successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Report not ready or doesn't exist",
  })
  async downloadReport(
    @Param('reportId') reportId: string,
    @Res() res: Response,
  ) {
    const report = await this.reportService.getReportById(reportId);
    if (!report) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Report not ready or doesn't exist.",
      });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.status(HttpStatus.OK).send(report);
  }

  // Endpoint to send the completed report via email
  @Post(':reportId/email')
  @ApiOperation({ summary: 'Send the completed report via email' })
  @ApiParam({ name: 'reportId', description: 'ID of the report' })
  @ApiBody({
    description: 'Email address to send the report to',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'example@email.com' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Report sent to email successfully',
  })
  async sendReportViaEmail(
    @Param('reportId') reportId: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const { email } = body;
    await this.reportService.sendReportByEmail(reportId, email);

    res.status(HttpStatus.OK).json({
      message: 'Report sent to email successfully.',
    });
  }
}
