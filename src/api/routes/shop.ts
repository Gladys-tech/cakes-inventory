import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { ShopController } from '../../controllers';

export default class ShopRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'ShopRoutes');
    }

    configureRoutes() {
        // Read
        this.app.route('/shops').get(ShopController.getShops);
        this.app.route('/shops/:id').get(ShopController.getShopById);

        // Create
        this.app.route('/shops').post(ShopController.createShop);

        // Update
        this.app.route('/shops/:id').put(ShopController.updateShop);

        // Delete
        this.app.route('/shops/:id').delete(ShopController.deleteShop);

        return this.app;
    }
}
