"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = exports.PaymentController = exports.SupplierController = exports.OrderController = exports.ProductController = exports.ShopController = exports.UserController = exports.CustomerController = void 0;
const user_1 = __importDefault(require("./user"));
exports.UserController = user_1.default;
const shop_1 = __importDefault(require("./shop"));
exports.ShopController = shop_1.default;
const product_1 = __importDefault(require("./product"));
exports.ProductController = product_1.default;
const customer_1 = __importDefault(require("./customer"));
exports.CustomerController = customer_1.default;
const order_1 = __importDefault(require("./order"));
exports.OrderController = order_1.default;
const supplier_1 = __importDefault(require("./supplier"));
exports.SupplierController = supplier_1.default;
const payment_1 = __importDefault(require("./payment"));
exports.PaymentController = payment_1.default;
const delivery_1 = __importDefault(require("./delivery"));
exports.DeliveryController = delivery_1.default;
//# sourceMappingURL=index.js.map