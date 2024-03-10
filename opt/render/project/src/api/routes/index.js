"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoutes = exports.PaymentRoutes = exports.SupplierRoutes = exports.OrderRoutes = exports.CustomerRoutes = exports.ProductRoutes = exports.ShopRoutes = exports.UserRoutes = void 0;
const user_1 = __importDefault(require("./user"));
exports.UserRoutes = user_1.default;
const shop_1 = __importDefault(require("./shop"));
exports.ShopRoutes = shop_1.default;
const product_1 = __importDefault(require("./product"));
exports.ProductRoutes = product_1.default;
const customer_1 = __importDefault(require("./customer"));
exports.CustomerRoutes = customer_1.default;
const order_1 = __importDefault(require("./order"));
exports.OrderRoutes = order_1.default;
const supplier_1 = __importDefault(require("./supplier"));
exports.SupplierRoutes = supplier_1.default;
const payment_1 = __importDefault(require("./payment"));
exports.PaymentRoutes = payment_1.default;
const delivery_1 = __importDefault(require("./delivery"));
exports.DeliveryRoutes = delivery_1.default;
//# sourceMappingURL=index.js.map