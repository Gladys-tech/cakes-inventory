import { Application } from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../../common/routes.config';
import { SupplierController } from '../../controllers';
import { authenticateToken } from '../../middleware/authMiddleware';

export default class SupplierRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'SupplierRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        this.app.use('/suppliers', authenticateToken);

        // Read
        this.app.route('/suppliers').get(SupplierController.getSuppliers);
        this.app
            .route('/suppliers/:id')
            .get(SupplierController.getSupplierById);

        // Create
        this.app.route('/suppliers').post(SupplierController.createSupplier);

        // Update
        this.app.route('/suppliers/:id').put(SupplierController.updateSupplier);

        // Delete
        this.app
            .route('/suppliers/:id')
            .delete(SupplierController.deleteSupplier);

        return this.app;
    }
}
