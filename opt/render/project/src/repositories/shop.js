"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRepository = void 0;
const shop_1 = require("../models/shop");
const data_source_1 = require("../data-source");
exports.ShopRepository = data_source_1.dataSource.getRepository(shop_1.Shop).extend({});
//# sourceMappingURL=shop.js.map