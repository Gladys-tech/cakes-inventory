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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
// import { SoftDeletableEntity } from './abstracts/soft-deleteable';
const order_1 = require("./order");
const payment_1 = require("./payment");
// /**
//  * @schema customer
//  *
//  * title: customer
//  *
//  * description: Customer entity
//  *
//  * x-resourceId: `customer`
//  *
//  * properties:
//  *
//  *     - id:
//  *         type: `integer`
//  *         description: The unique identifier for the customer.
//  *     - firstName:
//  *         type: `string`
//  *         description: The first name of the customer.
//  *     - lastName:
//  *         type: `string`
//  *         description: The last name of the customer.
//  *     - email:
//  *         type: `string`
//  *         description: The email address of the customer.
//  *     - location:
//  *         type: `string`
//  *         description: The location of the customer.
//  *     - telphone:
//  *          type: `number`
//  *          description: The phone number for the customer
//  *     - isEmailVerified:
//  *         type: `boolean`
//  *         description: Whether the customer has verified their email address.
//  *     - cart:
//  *         type: `json`
//  *         description: JSON array of products in the customer's cart.
//  *
//  * @relation Orders
//  * @order { createdAt: 'DESC' }
//  */
let Customer = class Customer {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "telphone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true })
    // cart: Array<{ productId: string; quantity: number }> | null;
    ,
    __metadata("design:type", Object)
], Customer.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_1.Order, (order) => order.customer),
    __metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_1.Payment, (payment) => payment.customer),
    __metadata("design:type", Array)
], Customer.prototype, "payments", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)()
], Customer);
//# sourceMappingURL=customer.js.map