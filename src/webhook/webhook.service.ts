import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../schemas/order-status.schema';
import { WebhookLogs, WebhookLogsDocument } from '../schemas/webhook-logs.schema';
import { WebhookDto } from '../dto/webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(WebhookLogs.name) private webhookLogsModel: Model<WebhookLogsDocument>,
  ) {}

  async processWebhook(webhookDto: WebhookDto) {
    try {
      const { status, order_info } = webhookDto;

      // Log the webhook request
      const webhookLog = new this.webhookLogsModel({
        order_id: order_info.order_id,
        status: status,
        payload: webhookDto,
        endpoint: '/webhook',
        method: 'POST',
      });

      await webhookLog.save();

      // Find the order by custom_order_id
      const order = await this.orderModel.findOne({ 
        custom_order_id: order_info.order_id 
      }).exec();

      if (!order) {
        webhookLog.error_message = 'Order not found';
        await webhookLog.save();
        throw new BadRequestException('Order not found');
      }

      // Check if order status already exists
      let orderStatus = await this.orderStatusModel.findOne({ 
        collect_id: order._id 
      }).exec();

      if (orderStatus) {
        // Update existing order status
        orderStatus.order_amount = order_info.order_amount;
        orderStatus.transaction_amount = order_info.transaction_amount;
        orderStatus.payment_mode = order_info.payment_mode;
        orderStatus.payment_details = order_info.payemnt_details;
        orderStatus.bank_reference = order_info.bank_reference;
        orderStatus.payment_message = order_info.Payment_message;
        orderStatus.status = order_info.status;
        orderStatus.error_message = order_info.error_message || null;
        orderStatus.payment_time = new Date(order_info.payment_time);
        orderStatus.updatedAt = new Date();
      } else {
        // Create new order status
        orderStatus = new this.orderStatusModel({
          collect_id: order._id,
          order_amount: order_info.order_amount,
          transaction_amount: order_info.transaction_amount,
          payment_mode: order_info.payment_mode,
          payment_details: order_info.payemnt_details,
          bank_reference: order_info.bank_reference,
          payment_message: order_info.Payment_message,
          status: order_info.status,
          error_message: order_info.error_message || null,
          payment_time: new Date(order_info.payment_time),
        });
      }

      await orderStatus.save();

      // Update webhook log with success
      webhookLog.response = { success: true, order_status_id: orderStatus._id };
      await webhookLog.save();

      return {
        success: true,
        message: 'Webhook processed successfully',
        order_id: order_info.order_id,
        status: order_info.status,
      };
    } catch (error) {
      // Log error in webhook logs
      const webhookLog = new this.webhookLogsModel({
        order_id: webhookDto.order_info?.order_id || 'unknown',
        status: webhookDto.status,
        payload: webhookDto,
        endpoint: '/webhook',
        method: 'POST',
        error_message: error.message,
      });
      await webhookLog.save();

      throw new BadRequestException(`Webhook processing failed: ${error.message}`);
    }
  }

  async getWebhookLogs() {
    return this.webhookLogsModel.find().sort({ createdAt: -1 }).exec();
  }
}
