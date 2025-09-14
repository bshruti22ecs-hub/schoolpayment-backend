import { Controller, Get, Param, Query, UseGuards, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionQueryDto } from '../dto/transaction-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Protected routes
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTransactions(@Query() query: TransactionQueryDto) {
    return this.transactionService.getAllTransactions(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('school/:schoolId')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.getTransactionsBySchool(schoolId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:customOrderId')
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    return this.transactionService.getTransactionStatus(customOrderId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction-status/:customOrderId')
  async getTransactionStatusAlt(@Param('customOrderId') customOrderId: string) {
    return this.transactionService.getTransactionStatus(customOrderId);
  }

  // Public route (no JWT required)
  @Post('dummy-data')
async createDummyData() {
  return this.transactionService.createDummyData();
}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTransaction(@Body() createTransactionDto: any) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

}

