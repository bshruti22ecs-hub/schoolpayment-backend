import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getDashboardStats() {
    try {
      // Get total count of orders
      const totalOrders = await this.orderModel.countDocuments();
      
      // Get aggregated amounts from order statuses
      const pipeline = [
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
          $group: {
            _id: null,
            totalAmount: { $sum: { $ifNull: ['$orderStatus.transaction_amount', 0] } },
            pendingAmount: {
              $sum: {
                $cond: [
                  { $eq: ['$orderStatus.status', 'pending'] },
                  { $ifNull: ['$orderStatus.transaction_amount', 0] },
                  0
                ]
              }
            },
            successfulAmount: {
              $sum: {
                $cond: [
                  { $eq: ['$orderStatus.status', 'success'] },
                  { $ifNull: ['$orderStatus.transaction_amount', 0] },
                  0
                ]
              }
            },
            failedAmount: {
              $sum: {
                $cond: [
                  { $eq: ['$orderStatus.status', 'failed'] },
                  { $ifNull: ['$orderStatus.transaction_amount', 0] },
                  0
                ]
              }
            },
            pendingCount: {
              $sum: {
                $cond: [
                  { $eq: ['$orderStatus.status', 'pending'] },
                  1,
                  0
                ]
              }
            },
            successfulCount: {
              $sum: {
                $cond: [
                  { $eq: ['$orderStatus.status', 'success'] },
                  1,
                  0
                ]
              }
            },
            failedCount: {
              $sum: {
                $cond: [
                  { $eq: ['$orderStatus.status', 'failed'] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ];

      const result = await this.orderModel.aggregate(pipeline).exec();
      const stats = result[0] || {
        totalAmount: 0,
        pendingAmount: 0,
        successfulAmount: 0,
        failedAmount: 0,
        pendingCount: 0,
        successfulCount: 0,
        failedCount: 0
      };

      const successRate = totalOrders > 0 ? (stats.successfulCount / totalOrders) * 100 : 0;

      return {
        success: true,
        data: {
          totalPayments: Math.round(stats.totalAmount),
          pendingPayments: Math.round(stats.pendingAmount),
          successfulPayments: Math.round(stats.successfulAmount),
          failedPayments: Math.round(stats.failedAmount),
          successRate: Math.round(successRate * 100) / 100,
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }  async getRecentTransactions(limit: number = 5) {
    try {
      const transactions = await this.orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
      
      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      throw new Error(`Failed to fetch recent transactions: ${error.message}`);
    }
  }
}



