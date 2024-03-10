"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
// import { authenticateToken } from '../../middleware/authMiddleware';
class SupplierRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'SupplierRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/products', authenticateToken);
        // Read
        this.app.route('/suppliers').get(controllers_1.SupplierController.getSuppliers);
        this.app
            .route('/suppliers/:id')
            .get(controllers_1.SupplierController.getSupplierById);
        // Create
        this.app.route('/suppliers').post(controllers_1.SupplierController.createSupplier);
        // Update
        this.app.route('/suppliers/:id').put(controllers_1.SupplierController.updateSupplier);
        // Delete
        this.app
            .route('/suppliers/:id')
            .delete(controllers_1.SupplierController.deleteSupplier);
        return this.app;
    }
}
exports.default = SupplierRoutes;
//# sourceMappingURL=supplier.js.map