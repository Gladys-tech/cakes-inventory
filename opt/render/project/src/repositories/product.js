"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const product_1 = require("../models/product");
const data_source_1 = require("../data-source");
exports.ProductRepository = data_source_1.dataSource.getRepository(product_1.Product).extend({});
//# sourceMappingURL=product.js.map