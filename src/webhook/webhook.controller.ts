import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppGateway } from 'src/app.gateway';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
        private readonly appGateway: AppGateway,
      ) {}
      @Get()
      verifyWebhook(@Req() res: Request): string {
        return this.webhookService.verifyWebhook(res.query);
      }
      @Post()
      receiveMessage(@Body() body: any): void {
        const message = this.webhookService.receiveMessage(body);
        this.appGateway.server.emit('msgToClient', message);
      }
}
