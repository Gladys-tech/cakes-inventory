import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { DeliveryController } from '../../controllers';
// import { authenticateToken } from '../../middleware/authMiddleware';

export default class DeliveryRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'DeliveryRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/deliveries', authenticateToken);

        this.app.route('/deliveries').post(DeliveryController.createDelivery);
        this.app
            .route('/deliveries/:id')
            .get(DeliveryController.getDeliveryById);
        this.app
            .route('/deliveries/:id')
            .put(DeliveryController.updateDelivery);
        this.app
            .route('/deliveries/:id')
            .delete(DeliveryController.deleteDelivery);

        return this.app;
    }
}
