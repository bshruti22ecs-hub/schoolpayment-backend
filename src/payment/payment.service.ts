import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      // Generate custom order ID if not provided
      const customOrderId = createPaymentDto.custom_order_id || 
        `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create order in database
      const order = new this.orderModel({
        school_id: createPaymentDto.school_id,
        trustee_id: createPaymentDto.trustee_id,
        student_info: {
          name: createPaymentDto.student_name,
          id: createPaymentDto.student_id,
          email: createPaymentDto.student_email,
        },
        gateway_name: createPaymentDto.gateway_name,
        custom_order_id: customOrderId,
      });

      await order.save();

      // Prepare payment request payload
      const paymentPayload = {
        pg_key: process.env.PG_KEY,
        school_id: process.env.SCHOOL_ID,
        custom_order_id: customOrderId,
        amount: createPaymentDto.amount,
        student_info: {
          name: createPaymentDto.student_name,
          id: createPaymentDto.student_id,
          email: createPaymentDto.student_email,
        },
        gateway: createPaymentDto.gateway_name,
        return_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payment/cancel`,
      };

      // Generate JWT token for payment API
      const jwtToken = jwt.sign(paymentPayload, process.env.API_KEY, {
        expiresIn: '1h',
      });

      // Make request to payment API
      const paymentApiUrl = 'https://api.payment-gateway.com/create-collect-request';
      const response = await fetch(paymentApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) {
        throw new BadRequestException('Payment gateway request failed');
      }

      const paymentResponse = await response.json();

      return {
        success: true,
        order_id: customOrderId,
        payment_url: paymentResponse.payment_url,
        collect_id: paymentResponse.collect_id,
        message: 'Payment request created successfully',
        data: paymentResponse,
      };
    } catch (error) {
      throw new BadRequestException(`Payment creation failed: ${error.message}`);
    }
  }

  async getPaymentStatus(orderId: string) {
    try {
      const order = await this.orderModel.findOne({ custom_order_id: orderId }).exec();
      if (!order) {
        throw new BadRequestException('Order not found');
      }

      // Here you would typically check with the payment gateway API
      // For now, return the order details
      return {
        order_id: order.custom_order_id,
        status: 'pending', // This would come from payment gateway
        amount: 0, // This would come from order status
        created_at: order.createdAt,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get payment status: ${error.message}`);
    }
  }
}
