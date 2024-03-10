"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
const authMiddleware_1 = require("../../middleware/authMiddleware");
class ShopRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'ShopRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        this.app.use('/shops', authMiddleware_1.authenticateToken);
        // Read
        this.app.route('/shops').get(controllers_1.ShopController.getShops);
        this.app.route('/shops/:id').get(controllers_1.ShopController.getShopById);
        // Create
        this.app.route('/shops').post(controllers_1.ShopController.createShop);
        // Update
        this.app.route('/shops/:id').put(controllers_1.ShopController.updateShop);
        // Delete
        this.app.route('/shops/:id').delete(controllers_1.ShopController.deleteShop);
        return this.app;
    }
}
exports.default = ShopRoutes;
//# sourceMappingURL=shop.js.map