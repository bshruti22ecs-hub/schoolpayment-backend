import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: 'pending' })
  status: string; // pending | success | failed

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  schoolId: string;

  @Prop()
  customOrderId?: string;

  @Prop()
  description?: string;

  @Prop()
  currency?: string;

  @Prop()
  paymentMethod?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
