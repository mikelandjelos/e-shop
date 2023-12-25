import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping/durable')
  async pingDurable(): Promise<string> {
    return await this.appService.pingDurable();
  }

  @Get('/ping/cache')
  async pingCache(): Promise<string> {
    return await this.appService.pingCache();
  }
}
