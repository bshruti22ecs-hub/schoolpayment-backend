import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';
import { TransactionQueryDto } from '../dto/transaction-query.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  async getAllTransactions(query: TransactionQueryDto) {
    console.log('Connected to DB:', this.orderModel.db.getClient().db().databaseName);

    try {
      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        school_id,
        status,
      } = query;

      const skip = (page - 1) * limit;
      const sortOrder = order === 'desc' ? -1 : 1;

      // Build match conditions
      const matchConditions: any = {};
      if (school_id) {
        matchConditions['order.school_id'] = school_id;
      }
      if (status) {
        matchConditions['orderStatus.status'] = status;
      }

      // Aggregation pipeline to join Order and OrderStatus
      const pipeline: any[] = [
        {
          $lookup: {
            from: 'orderstatuses',
            localField: '_id',
            foreignField: 'collect_id',
            as: 'orderStatus',
          },
        },
        {
          $unwind: {
            path: '$orderStatus',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: matchConditions,
        },
        {
          $project: {
            collect_id: '$_id',
            school_id: '$school_id',
            gateway: '$gateway_name',
            order_amount: { $toDouble: { $ifNull: ['$orderStatus.order_amount', 0] } },
            transaction_amount: { $toDouble: { $ifNull: ['$orderStatus.transaction_amount', 0] } },
            status: { $ifNull: ['$orderStatus.status', 'pending'] },
            custom_order_id: '$custom_order_id',
            student_info: '$student_info',
            payment_time: '$orderStatus.payment_time',
            created_at: '$createdAt',
            createdAt: '$createdAt',
          },
        },
        {
          $sort: { [sort]: sortOrder },
        },
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: 'count' }],
          },
        },
      ];

      const result = await this.orderModel.aggregate(pipeline).exec();
      const transactions = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;

      return {
        success: true,
        data: transactions,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fetch transactions: ${error.message}`);
    }
  }

  async getTransactionsBySchool(schoolId: string, query: TransactionQueryDto) {
    try {
      const result = await this.getAllTransactions({
        ...query,
        school_id: schoolId,
      });
      return result;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch transactions for school: ${error.message}`);
    }
  }

  async getTransactionStatus(customOrderId: string) {
    try {
      const pipeline: any[] = [
        {
          $match: { custom_order_id: customOrderId },
        },
        {
          $lookup: {
            from: 'orderstatuses',
            localField: '_id',
            foreignField: 'collect_id',
            as: 'orderStatus',
          },
        },
        {
          $unwind: {
            path: '$orderStatus',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            collect_id: '$_id',
            school_id: '$school_id',
            gateway: '$gateway_name',
            order_amount: { $toDouble: { $ifNull: ['$orderStatus.order_amount', 0] } },
            transaction_amount: { $toDouble: { $ifNull: ['$orderStatus.transaction_amount', 0] } },
            status: { $ifNull: ['$orderStatus.status', 'pending'] },
            custom_order_id: '$custom_order_id',
            student_info: '$student_info',
            payment_time: '$orderStatus.payment_time',
            payment_mode: '$orderStatus.payment_mode',
            bank_reference: '$orderStatus.bank_reference',
            payment_message: '$orderStatus.payment_message',
            error_message: '$orderStatus.error_message',
            created_at: '$createdAt',
            createdAt: '$createdAt',
          },
        },
      ];

      const result = await this.orderModel.aggregate(pipeline).exec();
      
      if (!result || result.length === 0) {
        throw new BadRequestException('Transaction not found');
      }

      return {
        success: true,
        data: result[0]
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get transaction status: ${error.message}`);
    }
  }

  async createTransaction(transactionData: any) {
    try {
      // Create order
      const order = new this.orderModel({
        school_id: transactionData.schoolId,
        trustee_id: transactionData.trusteeId || '65b0e6293e9f76a9694d84b5', // Default trustee
        student_info: {
          name: transactionData.studentName,
          id: transactionData.studentId,
          email: transactionData.studentEmail,
        },
        gateway_name: transactionData.paymentMethod || 'UPI',
        custom_order_id: `ORDER_${Date.now()}`,
      });

      const createdOrder = await order.save();

      // Create order status
      const orderStatus = new this.orderStatusModel({
        collect_id: createdOrder._id,
        order_amount: parseFloat(transactionData.amount),
        transaction_amount: parseFloat(transactionData.amount),
        payment_mode: transactionData.paymentMethod || 'upi',
        payment_details: transactionData.description || 'Payment initiated',
        bank_reference: `REF_${Date.now()}`,
        payment_message: 'Payment initiated',
        status: 'pending',
        error_message: null,
        payment_time: new Date(),
      });

      await orderStatus.save();

      return {
        success: true,
        data: {
          orderId: createdOrder._id,
          customOrderId: createdOrder.custom_order_id,
          amount: transactionData.amount,
          status: 'pending'
        },
        message: 'Transaction created successfully'
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create transaction: ${error.message}`);
    }
  }

  async createDummyData() {
    try {
      // Create dummy orders
      const dummyOrders = [
        {
          school_id: '65b0e6293e9f76a9694d84b4',
          trustee_id: '65b0e6293e9f76a9694d84b5',
          student_info: {
            name: 'John Doe',
            id: 'STU001',
            email: 'john.doe@example.com',
          },
          gateway_name: 'PhonePe',
          custom_order_id: 'ORDER_001',
        },
        {
          school_id: '65b0e6293e9f76a9694d84b4',
          trustee_id: '65b0e6293e9f76a9694d84b5',
          student_info: {
            name: 'Jane Smith',
            id: 'STU002',
            email: 'jane.smith@example.com',
          },
          gateway_name: 'Razorpay',
          custom_order_id: 'ORDER_002',
        },
      ];

      const createdOrders = await this.orderModel.insertMany(dummyOrders);

      // Create dummy order statuses
      const dummyOrderStatuses = [
        {
          collect_id: createdOrders[0]._id,
          order_amount: 2000,
          transaction_amount: 2200,
          payment_mode: 'upi',
          payment_details: 'success@ybl',
          bank_reference: 'YESBNK222',
          payment_message: 'payment success',
          status: 'success',
          error_message: null,
          payment_time: new Date(),
        },
        {
          collect_id: createdOrders[1]._id,
          order_amount: 1500,
          transaction_amount: 1500,
          payment_mode: 'card',
          payment_details: 'card ending 1234',
          bank_reference: 'HDFC123',
          payment_message: 'payment success',
          status: 'success',
          error_message: null,
          payment_time: new Date(),
        },
      ];

      await this.orderStatusModel.insertMany(dummyOrderStatuses);

      return {
        message: 'Dummy data created successfully',
        orders: createdOrders.length,
        orderStatuses: dummyOrderStatuses.length,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create dummy data: ${error.message}`);
    }
  }
}
