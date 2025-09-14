import { IsOptional, IsString, IsNumber, IsIn, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class TransactionQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['payment_time', 'status', 'transaction_amount', 'createdAt'])
  sort?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  order?: string = 'desc';

  @IsOptional()
  @IsString()
  school_id?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
