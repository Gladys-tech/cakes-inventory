"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class DeliveryController {
    constructor() {
        this.createDelivery = async (req, res) => {
            try {
                const newDelivery = await services_1.DeliveryService.createDelivery(req.body);
                res.status(201).json({
                    status: 'CREATED',
                    delivery: newDelivery,
                });
            }
            catch (error) {
                console.error('Error creating delivery:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating delivery.',
                });
            }
        };
        this.getDeliveryById = async (req, res) => {
            const deliveryId = req.params.id;
            try {
                const delivery = await services_1.DeliveryService.getDeliveryById(deliveryId);
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
            }
            catch (error) {
                console.error('Error retrieving delivery by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving delivery by ID.',
                });
            }
        };
        this.updateDelivery = async (req, res) => {
            const deliveryId = req.params.id;
            const updatedData = req.body;
            try {
                const updatedDelivery = await services_1.DeliveryService.updateDelivery(deliveryId, updatedData);
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
            }
            catch (error) {
                console.error('Error updating delivery:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating delivery.',
                });
            }
        };
        this.deleteDelivery = async (req, res) => {
            const deliveryId = req.params.id;
            try {
                const deletedDelivery = await services_1.DeliveryService.deleteDelivery(deliveryId);
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
            }
            catch (error) {
                console.error('Error deleting delivery:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting delivery.',
                });
            }
        };
    }
}
exports.default = new DeliveryController();
//# sourceMappingURL=delivery.js.map