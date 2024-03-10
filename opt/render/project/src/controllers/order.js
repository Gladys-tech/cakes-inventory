"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class OrderController {
    constructor() {
        //getting all orders
        this.getOrders = async (req, res) => {
            const orders = await services_1.OrderService.getAllOrders(req, res);
            if (!orders) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: `order not found.`,
                });
            }
            res.status(200).json({
                status: 'OK',
                orders,
            });
        };
        // getting order by id
        this.getOrderById = async (req, res) => {
            const orderId = req.params.id;
            try {
                const order = await services_1.OrderService.getOrderById(orderId);
                if (!order) {
                    return res.status(404).send({
                        status: 'NOT_FOUND',
                        message: `order not found with id: ${orderId}`,
                    });
                }
                res.status(200).json({
                    status: 'OK',
                    order,
                });
            }
            catch (error) {
                console.error('Error retrieving order by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving order by ID.',
                });
            }
        };
        // creating an order
        this.createOrder = async (req, res) => {
            const orderData = req.body;
            try {
                const newOrder = await services_1.OrderService.createOrder(orderData);
                res.status(201).json({
                    status: 'CREATED',
                    order: newOrder,
                });
            }
            catch (error) {
                console.error('Error creating order:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating order.',
                });
            }
        };
        // updating an order
        this.updateOrder = async (req, res) => {
            const orderId = req.params.id;
            const orderData = req.body;
            try {
                const updatedOrder = await services_1.OrderService.updateOrder(orderId, orderData);
                if (!updatedOrder) {
                    return res.status(404).json({
                        status: 'NOT_FOUND',
                        message: `order not found with id: ${orderId}`,
                    });
                }
                res.status(200).json({
                    status: 'OK',
                    order: updatedOrder,
                });
            }
            catch (error) {
                console.error('Error updating order:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating order.',
                });
            }
        };
        // delete an order
        this.deleteOrder = async (req, res) => {
            const orderId = req.params.id;
            try {
                const deletedOrder = await services_1.OrderService.deleteOrder(orderId);
                if (!deletedOrder) {
                    return res.status(404).json({
                        status: 'NOT_FOUND',
                        message: `order not found with id: ${orderId}`,
                    });
                }
                res.status(200).json({
                    status: 'OK',
                    message: `order with id ${orderId} has been deleted.`,
                });
            }
            catch (error) {
                console.error('Error deleting order:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting order.',
                });
            }
        };
    }
}
exports.default = new OrderController();
//# sourceMappingURL=order.js.map