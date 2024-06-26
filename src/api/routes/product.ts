import { Application } from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../../common/routes.config';
import { ProductController } from '../../controllers';
// import { authenticateToken } from '../../middleware/authMiddleware';

export default class ProductRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'ProductRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/products', authenticateToken);

        // Read
        this.app.route('/products').get(ProductController.getProducts);
        this.app.route('/products/:id').get(ProductController.getProductById);

        // Create
        this.app.route('/products').post(ProductController.createProduct);

        // Route to remove product image
        this.app
            .route('/products/:productId/images/:imageIndex')
            .delete(ProductController.removeProductImage);

        // Update
        this.app.route('/products/:id').put(ProductController.updateProduct);

        // Delete
        this.app.route('/products/:id').delete(ProductController.deleteProduct);

        return this.app;
    }
}
