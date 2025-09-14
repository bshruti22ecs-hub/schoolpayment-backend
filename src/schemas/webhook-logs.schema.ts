import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogsDocument = WebhookLogs & Document;

@Schema({ timestamps: true })
export class WebhookLogs {
  @Prop({ required: true })
  order_id: string;

  @Prop({ required: true })
  status: number;

  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ required: true })
  endpoint: string;

  @Prop({ required: true })
  method: string;

  @Prop({ type: Object, default: null })
  response: any;

  @Prop({ default: null })
  error_message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const WebhookLogsSchema = SchemaFactory.createForClass(WebhookLogs);
