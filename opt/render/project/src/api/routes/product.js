"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
const authMiddleware_1 = require("../../middleware/authMiddleware");
class ProductRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'ProductRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        this.app.use('/products', authMiddleware_1.authenticateToken);
        // Read
        this.app.route('/products').get(controllers_1.ProductController.getProducts);
        this.app.route('/products/:id').get(controllers_1.ProductController.getProductById);
        // Create
        this.app.route('/products').post(controllers_1.ProductController.createProduct);
        // Update
        this.app.route('/products/:id').put(controllers_1.ProductController.updateProduct);
        // Delete
        this.app.route('/products/:id').delete(controllers_1.ProductController.deleteProduct);
        return this.app;
    }
}
exports.default = ProductRoutes;
//# sourceMappingURL=product.js.map