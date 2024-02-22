import axios from 'axios';
import { Payment, PaymentStatus } from '../models/payment';
import {
    CustomerRepository,
    OrderRepository,
    PaymentRepository,
} from '../repositories';
import { DeepPartial } from 'typeorm';
import { PaymentMethod } from '../models/order';

class PaymentService {
    private readonly paymentRepository: typeof PaymentRepository;

    constructor() {
        this.paymentRepository = PaymentRepository;
    }

    /**
     * Create a new payment for "cash on delivery" orders
     */

    public createPayment = async (
        status: PaymentStatus,
        orderId: string,
        customerId: string
    ): Promise<Payment> => {
        const currentDate = new Date();

        // Check if the order has already been paid
        const existingPaymentForOrder = await this.paymentRepository.findOne({
            where: { order: { id: orderId } },
        });

        if (existingPaymentForOrder) {
            throw new Error(`Order with id ${orderId} has already been paid.`);
        }

        // Fetch the associated Order from the OrderRepository
        const order = await OrderRepository.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error(`Order not found with id: ${orderId}`);
        }

        // Check if the payment method is "cash on delivery"
        if (order.paymentMethod !== PaymentMethod.CashOnDelivery) {
            throw new Error(`Payment can only be created for "cash on delivery" orders.`);
        }


        // Fetch the associated Customer from the CustomerRepository
        const customer = await CustomerRepository.findOne({
            where: { id: customerId },
        });

        if (!customer) {
            throw new Error(`Customer not found with id: ${customerId}`);
        }

        // Calculate the amountPaid based on orderValue
        const amountPaid = order.orderValue;

        const newPayment = this.paymentRepository.create({
            dateOfPayment: currentDate.toISOString().split('T')[0],
            amountPaid: amountPaid,
            status: status,
            order: order,
            customer: customer,
        } as Payment);

        await this.paymentRepository.save(newPayment);
        return newPayment;
    };

    /**
     * Update payment status by ID
     */
    public updatePaymentStatus = async (
        paymentId: string,
        status: PaymentStatus
    ): Promise<Payment | null> => {
        const existingPayment = await this.paymentRepository.findOne({
            where: { id: paymentId },
        });

        if (!existingPayment) {
            return null; // payment not found
        }

        existingPayment.status = status;
        await this.paymentRepository.save(existingPayment);

        return existingPayment;
    };


     /**
     * Process payment using Flutterwave
     */
     public processFlutterwavePayment = async (
        orderId: string,
        customerId: string
    ): Promise<string> => {
        // Fetch order and customer details
        const order = await OrderRepository.findOne({
            where: { id: orderId },
        });

        if (!order) {
            throw new Error(`Order not found with id: ${orderId}`);
        }

        const customer = await CustomerRepository.findOne({
            where: { id: customerId },
        });

        if (!customer) {
            throw new Error(`Customer not found with id: ${customerId}`);
        }

        // Calculate the amount to be paid
        const amountToPay = order.orderValue;

        // Construct the Flutterwave payment payload
        const paymentPayload = {
            tx_ref: 'unique_transaction_reference', // Generate a unique transaction reference
            amount: amountToPay,
            currency: 'NGN', // Adjust the currency as needed
            payment_type: 'card',
            redirect_url: 'your_redirect_url',
            order_id: orderId,
            customer: {
                email: customer.email,
                // phonenumber: customer.phone,
                name: `${customer.firstName} ${customer.lastName}`,
            },
            customizations: {
                title: 'Your Payment Title',
                description: 'Your Payment Description',
                logo: 'your_logo_url',
            },
        };

        // Make a request to Flutterwave API
        const flutterwaveResponse = await axios.post(
            'https://api.flutterwave.com/v3/charges?type=card',
            paymentPayload,
            {
                headers: {
                    Authorization: 'Bearer your_flutterwave_secret_key',
                },
            }
        );

        // Handle the Flutterwave API response
        // Note: You need to implement proper error handling and response processing here

        // Return the Flutterwave payment URL
        return flutterwaveResponse.data.data.link;
    };
    
}

export default new PaymentService();
