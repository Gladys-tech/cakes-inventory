import { Payment, PaymentStatus } from '../models/payment';
import { CustomerRepository, OrderRepository, PaymentRepository } from '../repositories';
import { DeepPartial } from 'typeorm';

class PaymentService {
    private readonly paymentRepository: typeof PaymentRepository;

    constructor() {
        this.paymentRepository = PaymentRepository;
    }

    /**
     * Create a new payment
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
}

export default new PaymentService();
