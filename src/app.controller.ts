import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from 'common/config/config.service';
import { Response } from 'express';

@Controller()
export class AppController {
  private readonly apiDocs: string;

  constructor(private readonly config: ConfigService) {
    this.apiDocs = config.api.docs;
  }

  @Get('')
  @ApiExcludeEndpoint()
  async root(@Res() res: Response): Promise<void> {
    return res.redirect(this.apiDocs);
  }
}
