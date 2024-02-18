// payment.routes.ts
import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import {PaymentController} from '../../controllers';

export default class PaymentRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'PaymentRoutes');
    }

    configureRoutes() {
        this.app.route('/payments').post(PaymentController.createPayment);
        this.app.route('/payments/:id/status').put(PaymentController.updatePaymentStatus);

        return this.app;
    }
}

