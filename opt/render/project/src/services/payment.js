"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const repositories_1 = require("../repositories");
const order_1 = require("../models/order");
class PaymentService {
    constructor() {
        /**
         * Create a new payment for "cash on delivery" orders
         */
        this.createPayment = async (status, orderId, customerId) => {
            const currentDate = new Date();
            // Check if the order has already been paid
            const existingPaymentForOrder = await this.paymentRepository.findOne({
                where: { order: { id: orderId } },
            });
            if (existingPaymentForOrder) {
                throw new Error(`Order with id ${orderId} has already been paid.`);
            }
            // Fetch the associated Order from the OrderRepository
            const order = await repositories_1.OrderRepository.findOne({
                where: { id: orderId },
            });
            if (!order) {
                throw new Error(`Order not found with id: ${orderId}`);
            }
            // Check if the payment method is "cash on delivery"
            if (order.paymentMethod !== order_1.PaymentMethod.CashOnDelivery) {
                throw new Error(`Payment can only be created for "cash on delivery" orders.`);
            }
            // Fetch the associated Customer from the CustomerRepository
            const customer = await repositories_1.CustomerRepository.findOne({
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
            });
            await this.paymentRepository.save(newPayment);
            return newPayment;
        };
        /**
         * Update payment status by ID
         */
        this.updatePaymentStatus = async (paymentId, status) => {
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
        //  public processFlutterwavePayment = async (
        //     orderId: string,
        //     customerId: string
        // ): Promise<string> => {
        //     // Fetch order and customer details
        //     const order = await OrderRepository.findOne({
        //         where: { id: orderId },
        //     });
        //     if (!order) {
        //         throw new Error(`Order not found with id: ${orderId}`);
        //     }
        //     const customer = await CustomerRepository.findOne({
        //         where: { id: customerId },
        //     });
        //     if (!customer) {
        //         throw new Error(`Customer not found with id: ${customerId}`);
        //     }
        //     // Calculate the amount to be paid
        //     const amountToPay = order.orderValue;
        //     // Construct the Flutterwave payment payload
        //     const paymentPayload = {
        //         tx_ref: 'unique_transaction_reference', // Generate a unique transaction reference
        //         amount: amountToPay,
        //         currency: 'NGN', // Adjust the currency as needed
        //         payment_type: 'card',
        //         redirect_url: 'your_redirect_url',
        //         order_id: orderId,
        //         customer: {
        //             email: customer.email,
        //             // phonenumber: customer.phone,
        //             name: `${customer.firstName} ${customer.lastName}`,
        //         },
        //         customizations: {
        //             title: 'Your Payment Title',
        //             description: 'Your Payment Description',
        //             logo: 'your_logo_url',
        //         },
        //     };
        //     // Make a request to Flutterwave API
        //     const flutterwaveResponse = await axios.post(
        //         'https://api.flutterwave.com/v3/charges?type=card',
        //         paymentPayload,
        //         {
        //             headers: {
        //                 Authorization: 'Bearer your_flutterwave_secret_key',
        //             },
        //         }
        //     );
        //     // Handle the Flutterwave API response
        //     // Note: You need to implement proper error handling and response processing here
        //     // Return the Flutterwave payment URL
        //     return flutterwaveResponse.data.data.link;
        // };
        //  Process payment using MTN Sandbox
        this.processMTNPayment = async (orderId, customerId) => {
            // Fetch order and customer details
            const order = await repositories_1.OrderRepository.findOne({
                where: { id: orderId },
            });
            if (!order) {
                throw new Error(`Order not found with id: ${orderId}`);
            }
            const customer = await repositories_1.CustomerRepository.findOne({
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
            const uniqueReferenceId = `myApp_${Date.now()}`;
            // Make a request to MTN Sandbox API
            const mtnSandboxResponse = await axios_1.default.post('https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay', paymentPayload, {
                headers: {
                    'Ocp-Apim-Subscription-Key': '8abead82195b481486600b89a90a4e2a',
                    // 'Primary-Key': 'f2c872d50a194b6eac48393f1bf13aae',
                    // 'Secondary-Key': '8abead82195b481486600b89a90a4e2a',
                    'X-Reference-Id': uniqueReferenceId, // Generate a unique reference ID
                },
            });
            // Check if the response is successful before accessing data
            if (mtnSandboxResponse && mtnSandboxResponse.data && mtnSandboxResponse.data.link) {
                // Return the MTN Sandbox payment URL
                return mtnSandboxResponse.data.link;
            }
            else {
                throw new Error('Invalid response from MTN Sandbox API');
            }
        };
        this.paymentRepository = repositories_1.PaymentRepository;
    }
    catch(error) {
        // Handle errors here (log, report, etc.)
        console.error('Error processing MTN payment:', error);
        throw new Error('Error processing MTN payment');
    }
}
;
exports.default = new PaymentService();
//# sourceMappingURL=payment.js.map