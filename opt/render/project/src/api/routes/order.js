"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
// import { authenticateToken } from '../../middleware/authMiddleware';
class OrderRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'OrderRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/orders', authenticateToken);
        // Read
        this.app.route('/orders').get(controllers_1.OrderController.getOrders);
        this.app.route('/orders/:id').get(controllers_1.OrderController.getOrderById);
        // Create
        this.app.route('/orders').post(controllers_1.OrderController.createOrder);
        // Update
        this.app.route('/orders/:id').put(controllers_1.OrderController.updateOrder);
        // Delete
        this.app.route('/orders/:id').delete(controllers_1.OrderController.deleteOrder);
        return this.app;
    }
}
exports.default = OrderRoutes;
//# sourceMappingURL=order.js.map