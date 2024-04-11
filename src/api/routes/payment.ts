import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { PaymentController } from '../../controllers';
import { authenticateToken } from '../../middleware/authMiddleware';

export default class PaymentRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'PaymentRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        this.app.use('/payments', authenticateToken);


        this.app.route('/payments').post(PaymentController.createPayment);
        // this.app
        //     .route('/payments/flutterwave')
        //     .post(PaymentController.processFlutterwavePayment);

        this.app
            .route('/payments/mtn')
            .post(PaymentController.processMTNPayment);
        this.app
            .route('/payments/:id/status')
            .put(PaymentController.updatePaymentStatus);

        return this.app;
    }
}
