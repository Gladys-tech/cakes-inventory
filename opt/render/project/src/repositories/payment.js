"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const payment_1 = require("../models/payment");
const data_source_1 = require("../data-source");
exports.PaymentRepository = data_source_1.dataSource.getRepository(payment_1.Payment).extend({});
//# sourceMappingURL=payment.js.map