"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRepository = void 0;
const delivery_1 = require("../models/delivery");
const data_source_1 = require("../data-source");
exports.DeliveryRepository = data_source_1.dataSource.getRepository(delivery_1.Delivery).extend({});
//# sourceMappingURL=delivery.js.map