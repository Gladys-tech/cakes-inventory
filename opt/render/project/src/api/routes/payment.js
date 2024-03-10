"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
class PaymentRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'PaymentRoutes');
    }
    configureRoutes() {
        this.app.route('/payments').post(controllers_1.PaymentController.createPayment);
        // this.app
        //     .route('/payments/flutterwave')
        //     .post(PaymentController.processFlutterwavePayment);
        this.app.route('/payments/mtn').post(controllers_1.PaymentController.processMTNPayment);
        this.app
            .route('/payments/:id/status')
            .put(controllers_1.PaymentController.updatePaymentStatus);
        return this.app;
    }
}
exports.default = PaymentRoutes;
//# sourceMappingURL=payment.js.map