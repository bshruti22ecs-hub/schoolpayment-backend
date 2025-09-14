import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookDto } from '../dto/webhook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async processWebhook(@Body() webhookDto: WebhookDto) {
    return this.webhookService.processWebhook(webhookDto);
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  async getWebhookLogs() {
    return this.webhookService.getWebhookLogs();
  }
}
