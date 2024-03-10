"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const customer_1 = require("../models/customer");
const data_source_1 = require("../data-source");
exports.CustomerRepository = data_source_1.dataSource.getRepository(customer_1.Customer).extend({});
//# sourceMappingURL=customer.js.map