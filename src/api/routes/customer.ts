import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { CustomerController } from '../../controllers';
// import { authenticateToken } from '../../middleware/authMiddleware';

export default class CustomerRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'CustomerRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/customers', authenticateToken);

        // Read
        this.app.route('/customers').get(CustomerController.getCustomers);
        this.app
            .route('/customers/:id')
            .get(CustomerController.getCustomerById);

        // Create
        this.app.route('/customers').post(CustomerController.createCustomer);

        // Update
        this.app.route('/customers/:id').put(CustomerController.updateCustomer);

        // Delete
        this.app
            .route('/customers/:id')
            .delete(CustomerController.deleteCustomer);

        return this.app;
    }
}