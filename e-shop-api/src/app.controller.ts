import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping/durable')
  async pingDurable(): Promise<string> {
    return `${await this.appService.pingDurable()} from ${
      process.env.REDIS_DURABLE_PORT
    }`;
  }

  @Get('/ping/cache')
  async pingCache(): Promise<string> {
    return `${await this.appService.pingCache()} from ${
      process.env.REDIS_CACHE_PORT
    }`;
  }
}
