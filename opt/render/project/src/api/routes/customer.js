"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
// import { authenticateToken } from '../../middleware/authMiddleware';
class CustomerRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'CustomerRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/customers', authenticateToken);
        // Read
        this.app.route('/customers').get(controllers_1.CustomerController.getCustomers);
        this.app
            .route('/customers/:id')
            .get(controllers_1.CustomerController.getCustomerById);
        // Create
        this.app.route('/customers').post(controllers_1.CustomerController.createCustomer);
        // Update
        this.app.route('/customers/:id').put(controllers_1.CustomerController.updateCustomer);
        // Delete
        this.app
            .route('/customers/:id')
            .delete(controllers_1.CustomerController.deleteCustomer);
        return this.app;
    }
}
exports.default = CustomerRoutes;
//# sourceMappingURL=customer.js.map