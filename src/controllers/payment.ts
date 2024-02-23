
import { Request, Response } from 'express';
import { PaymentService } from '../services';
import { Payment, PaymentStatus } from '../models/payment';

class PaymentController {
    public createPayment = async (req: Request, res: Response) => {
        const { status, orderId, customerId } = req.body;

        try {
            const newPayment = await PaymentService.createPayment(
                status,
                orderId,
                customerId
            );

            res.status(201).json({
                status: 'CREATED',
                payment: newPayment,
            });
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating payment.',
            });
        }
    };

    public updatePaymentStatus = async (req: Request, res: Response) => {
        const paymentId = req.params.id;
        const { status } = req.body;

        try {
            const updatedPayment = await PaymentService.updatePaymentStatus(
                paymentId,
                status
            );

            if (!updatedPayment) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `payment not found with id: ${paymentId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                payment: updatedPayment,
            });
        } catch (error) {
            console.error('Error updating payment status:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating payment status.',
            });
        }
    };

    // public processFlutterwavePayment = async (req: Request, res: Response) => {
    //     const { orderId, customerId } = req.body;

    //     try {
    //         // Update this line to use Flutterwave payment URL
    //         const flutterwavePaymentUrl =
    //             await PaymentService.processFlutterwavePayment(
    //                 orderId,
    //                 customerId
    //             );

    //         // You can choose to redirect the user to the Flutterwave payment URL
    //         // or use it in your frontend to initiate the payment.

    //         // For now, we're just returning the Flutterwave payment URL in the response.
    //         res.status(200).json({
    //             status: 'OK',
    //             flutterwavePaymentUrl,
    //         });
    //     } catch (error) {
    //         console.error('Error processing Flutterwave payment:', error);
    //         res.status(500).json({
    //             status: 'INTERNAL_SERVER_ERROR',
    //             message: 'Error processing Flutterwave payment.',
    //         });
    //     }
    // };


    public processMTNPayment = async (req: Request, res: Response) => {
        const { orderId, customerId } = req.body;

        try {
            // Process MTN payment using the PaymentService method
            const mtnPaymentUrl = await PaymentService.processMTNPayment(
                orderId,
                customerId
            );

            // You can choose to redirect the user to the MTN payment URL
            // or use it in your frontend to initiate the payment.

            // For now, we're just returning the MTN payment URL in the response.
            res.status(200).json({
                status: 'OK',
                mtnPaymentUrl,
            });
        } catch (error) {
            console.error('Error processing MTN payment:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error processing MTN payment.',
            });
        }
    };
}

export default new PaymentController();
