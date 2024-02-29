import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { OrderController } from '../../controllers';
// import { authenticateToken } from '../../middleware/authMiddleware';

export default class OrderRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'OrderRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/orders', authenticateToken);

        // Read
        this.app.route('/orders').get(OrderController.getOrders);
        this.app.route('/orders/:id').get(OrderController.getOrderById);

        // Create
        this.app.route('/orders').post(OrderController.createOrder);

        // Update
        this.app.route('/orders/:id').put(OrderController.updateOrder);

        // Update product status within an order
        this.app.route('/orders/:orderId/products/:productId/status')
            .put(OrderController.updateProductStatus);

        // Delete
        this.app.route('/orders/:id').delete(OrderController.deleteOrder);

        return this.app;
    }
}
