import { Request, Response } from 'express';
import { DeliveryService } from '../services';
import { DeliveryStatus } from '../models/delivery';

class DeliveryController {
    public createDelivery = async (req: Request, res: Response) => {
        try {
            const newDelivery = await DeliveryService.createDelivery(req.body);
            res.status(201).json({
                status: 'CREATED',
                delivery: newDelivery,
            });
        } catch (error) {
            console.error('Error creating delivery:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating delivery.',
            });
        }
    };

    public getDeliveryById = async (req: Request, res: Response) => {
        const deliveryId = req.params.id;

        try {
            const delivery = await DeliveryService.getDeliveryById(deliveryId);

            if (!delivery) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Delivery not found with id: ${deliveryId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                delivery,
            });
        } catch (error) {
            console.error('Error retrieving delivery by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving delivery by ID.',
            });
        }
    };

    public updateDelivery = async (req: Request, res: Response) => {
        const deliveryId = req.params.id;
        const updatedData = req.body;

        try {
            const updatedDelivery = await DeliveryService.updateDelivery(
                deliveryId,
                updatedData
            );

            if (!updatedDelivery) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Delivery not found with id: ${deliveryId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                delivery: updatedDelivery,
            });
        } catch (error) {
            console.error('Error updating delivery:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating delivery.',
            });
        }
    };

    public deleteDelivery = async (req: Request, res: Response) => {
        const deliveryId = req.params.id;

        try {
            const deletedDelivery = await DeliveryService.deleteDelivery(
                deliveryId
            );

            if (!deletedDelivery) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Delivery not found with id: ${deliveryId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                message: `Delivery with id ${deliveryId} has been deleted.`,
            });
        } catch (error) {
            console.error('Error deleting delivery:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting delivery.',
            });
        }
    };
}

export default new DeliveryController();
