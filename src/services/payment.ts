import axios from 'axios';
import { Payment, PaymentStatus } from '../models/payment';
import {
    CustomerRepository,
    OrderRepository,
    PaymentRepository,
} from '../repositories';
import { DeepPartial } from 'typeorm';
import { PaymentMethod } from '../models/order';
import { v4 as uuidv4 } from 'uuid';

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
            throw new Error(
                `Payment can only be created for "cash on delivery" orders.`
            );
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

        // Access totalCommission and actualMoney from the associated Order
        const totalCommission = order.totalCommission;
        const actualMoney = order.actualMoney;

        const newPayment = this.paymentRepository.create({
            dateOfPayment: currentDate.toISOString().split('T')[0],
            amountPaid: amountPaid,
            status: status,
            order: order,
            customer: customer,
            totalCommission: totalCommission,
            actualMoney: actualMoney,
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

    public processMTNPayment = async (
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

        // Construct the MTN Sandbox payment payload
        const paymentPayload = {
            amount: amountToPay,
            currency: 'UGX', // Adjust the currency as needed
            externalId: orderId,
            payer: {
                partyIdType: 'MSISDN',
                partyId: customer.telphone, // Assuming phone number is used as partyId
            },
            payerMessage: 'Payment for order ' + orderId,
            payeeNote: 'Thank you for your order!',
        };

        // Generate a unique reference ID
        const uniqueReferenceId = uuidv4();

        // Make a request to MTN Sandbox API
        const mtnSandboxResponse = await axios.post(
            'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
            paymentPayload,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key':
                        '2642431f589b41d6b3afd4090c4d9460',
                    // 'Primary-Key': '21b34be9bf4f42f9acefb0acef0b0a91',
                    // 'Secondary-Key': '2642431f589b41d6b3afd4090c4d9460',
                    'X-Reference-Id': uniqueReferenceId, // Generate a unique reference ID
                },
            }
        );

        // Check if the response is successful before accessing data
        if (
            mtnSandboxResponse &&
            mtnSandboxResponse.data &&
            mtnSandboxResponse.data.link
        ) {
            // Return the MTN Sandbox payment URL
            return mtnSandboxResponse.data.link;
        } else {
            throw new Error('Invalid response from MTN Sandbox API');
        }
    };
    catch(error) {
        // Handle errors here (log, report, etc.)
        console.error('Error processing MTN payment:', error);
        throw new Error('Error processing MTN payment');
    }
}

export default new PaymentService();
