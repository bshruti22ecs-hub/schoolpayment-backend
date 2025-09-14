import { IsString, IsNumber, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  trustee_id: string;

  @IsString()
  @IsNotEmpty()
  student_name: string;

  @IsString()
  @IsNotEmpty()
  student_id: string;

  @IsEmail()
  @IsNotEmpty()
  student_email: string;

  @IsString()
  @IsNotEmpty()
  gateway_name: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  custom_order_id?: string;
}
