"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const order_1 = require("../models/order");
const data_source_1 = require("../data-source");
exports.OrderRepository = data_source_1.dataSource.getRepository(order_1.Order).extend({});
//# sourceMappingURL=order.js.map