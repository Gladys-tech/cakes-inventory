import { Request, Response, request, response } from 'express';
import { OrderService } from '../services';

class OrderController {
    //getting all orders
    public getOrders = async (req: Request, res: Response) => {
        const orders = await OrderService.getAllOrders(req, res);

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
    public getOrderById = async (req: Request, res: Response) => {
        const orderId = req.params.id;

        try {
            const order = await OrderService.getOrderById(orderId);

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
        } catch (error) {
            console.error('Error retrieving order by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving order by ID.',
            });
        }
    };

    // Controller method for retrieving orders by shop ID
    public getOrdersByShopId = async (req: Request, res: Response) => {
        const { shopId } = req.params;

        try {
            const orders = await OrderService.getOrdersByShopId(shopId);
            // Respond with the retrieved orders
            res.json({ status: 'OK', orders });
        } catch (error) {
            console.error('Error retrieving orders by shop ID:', error.message);
            // Handle the error and send an error response
            res.status(500).json({
                status: 'Error',
                message: 'Internal server error',
            });
        }
    };

    // creating an order
    public createOrder = async (req: Request, res: Response) => {
        const orderData = req.body;

        try {
            const newOrder = await OrderService.createOrder(orderData);

            res.status(201).json({
                status: 'CREATED',
                order: newOrder,
            });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating order.',
            });
        }
    };

    // updating an order
    public updateOrder = async (req: Request, res: Response) => {
        const orderId = req.params.id;
        const orderData = req.body;

        try {
            const updatedOrder = await OrderService.updateOrder(
                orderId,
                orderData
            );

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
        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating order.',
            });
        }
    };

    // delete an order
    public deleteOrder = async (req: Request, res: Response) => {
        const orderId = req.params.id;

        try {
            const deletedOrder = await OrderService.deleteOrder(orderId);

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
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting order.',
            });
        }
    };
}

export default new OrderController();
