"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
// import { authenticateToken } from '../../middleware/authMiddleware';
class DeliveryRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'DeliveryRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/deliveries', authenticateToken);
        this.app.route('/deliveries').post(controllers_1.DeliveryController.createDelivery);
        this.app
            .route('/deliveries/:id')
            .get(controllers_1.DeliveryController.getDeliveryById);
        this.app
            .route('/deliveries/:id')
            .put(controllers_1.DeliveryController.updateDelivery);
        this.app
            .route('/deliveries/:id')
            .delete(controllers_1.DeliveryController.deleteDelivery);
        return this.app;
    }
}
exports.default = DeliveryRoutes;
//# sourceMappingURL=delivery.js.map