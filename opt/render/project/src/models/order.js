"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.PaymentMethod = void 0;
const typeorm_1 = require("typeorm");
const customer_1 = require("./customer");
const product_1 = require("./product");
const payment_1 = require("./payment");
const delivery_1 = require("./delivery");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["AirtelMoney"] = "airtel_money";
    PaymentMethod["MTNMobileMoney"] = "mtn_mobile_money";
    PaymentMethod["CashOnDelivery"] = "cash_on_delivery";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
/**
 * @schema order
 *
 * title: order
 *
 * description: Order entity
 *
 * x-resourceId: `order`
 *
 * properties:
 *
 *     - id:
 *         type: `integer`
 *         description: The unique identifier for the order.
 *     - serialNumber:
 *         type: `string`
 *         description: Auto-generated serial number for the product in the order.
 *     - orderValue:
 *         type: `number`
 *         description: Total price of the order.
 *     - quantity:
 *         type: `integer`
 *         description: Total number of products in the order.
 *     - client:
 *         type: `string`
 *         description: Name of the customer placing the order.
 *     - expectedDeliveryDate:
 *         type: `string`
 *         format: `date`
 *         description: Expected date of delivery for the order.
 *     - status:
 *         type: `string`
 *         enum: [order made, confirmed, transit, delivered, cancelled, delayed]
 *         description: Status of the order.
 *
 * @relation Customer
 */
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Order.prototype, "orderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Order.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Order.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: [
            'order made',
            'confirmed',
            'transit',
            'delivered',
            'cancelled',
            'delayed',
        ],
        default: 'order made',
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer, (customer) => customer.orders),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_1.Customer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => product_1.Product, (product) => product.orders),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Order.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
        default: PaymentMethod.CashOnDelivery,
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_1.Payment, (payment) => payment.order),
    __metadata("design:type", Array)
], Order.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => delivery_1.Delivery, (delivery) => delivery.order),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", delivery_1.Delivery)
], Order.prototype, "delivery", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
//# sourceMappingURL=order.js.map