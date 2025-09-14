import { IsString, IsNumber, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderInfoDto {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsNumber()
  @IsNotEmpty()
  order_amount: number;

  @IsNumber()
  @IsNotEmpty()
  transaction_amount: number;

  @IsString()
  @IsNotEmpty()
  gateway: string;

  @IsString()
  @IsNotEmpty()
  bank_reference: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  payment_mode: string;

  @IsString()
  @IsNotEmpty()
  payemnt_details: string;

  @IsString()
  @IsNotEmpty()
  Payment_message: string;

  @IsString()
  @IsNotEmpty()
  payment_time: string;

  @IsString()
  @IsOptional()
  error_message?: string;
}

export class WebhookDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @ValidateNested()
  @Type(() => OrderInfoDto)
  @IsNotEmpty()
  order_info: OrderInfoDto;
}
