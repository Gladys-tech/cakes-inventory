"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = exports.PaymentService = exports.SupplierService = exports.OrderService = exports.ProductService = exports.ShopService = exports.UserService = exports.CustomerService = void 0;
const user_1 = __importDefault(require("./user"));
exports.UserService = user_1.default;
const shop_1 = __importDefault(require("./shop"));
exports.ShopService = shop_1.default;
const product_1 = __importDefault(require("./product"));
exports.ProductService = product_1.default;
const customer_1 = __importDefault(require("./customer"));
exports.CustomerService = customer_1.default;
const order_1 = __importDefault(require("./order"));
exports.OrderService = order_1.default;
const supplier_1 = __importDefault(require("./supplier"));
exports.SupplierService = supplier_1.default;
const payment_1 = __importDefault(require("./payment"));
exports.PaymentService = payment_1.default;
const delivery_1 = __importDefault(require("./delivery"));
exports.DeliveryService = delivery_1.default;
//# sourceMappingURL=index.js.map