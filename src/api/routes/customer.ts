import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { CustomerController } from '../../controllers';
import { authenticateToken } from '../../middleware/authMiddleware';

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

        // Get all orders for a user
        this.app
            .route('/users/:userId/orders')
            .get(CustomerController.getOrdersByUserId);

        // Delete
        this.app
            .route('/customers/:id')
            .delete(CustomerController.deleteCustomer);

        // New route to get customers by userId
        this.app.route('/customers/:userId').get(CustomerController.getCustomerByUserId);

        return this.app;
    }
}
