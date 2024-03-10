"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierRepository = void 0;
const supplier_1 = require("../models/supplier");
const data_source_1 = require("../data-source");
exports.SupplierRepository = data_source_1.dataSource.getRepository(supplier_1.Supplier).extend({});
//# sourceMappingURL=supplier.js.map