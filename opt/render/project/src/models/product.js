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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const shop_1 = require("./shop");
const order_1 = require("./order");
const productImage_1 = require("./productImage");
const supplier_1 = require("./supplier");
const delivery_1 = require("./delivery");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }) // Use 'decimal' type for decimal values
    ,
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }) // New field for inventory quantity
    ,
    __metadata("design:type", Number)
], Product.prototype, "inventoryQuantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_1.Supplier, (supplier) => supplier.product, {
        nullable: true, // Make the relationship optional
    }),
    __metadata("design:type", supplier_1.Supplier)
], Product.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "primaryImageUrl", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => productImage_1.ProductImage, (image) => image.product, { cascade: true }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => shop_1.Shop, (shop) => shop.products),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Product.prototype, "shops", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => order_1.Order, (order) => order.products, {
        cascade: ['remove'],
    }),
    __metadata("design:type", Array)
], Product.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => delivery_1.Delivery, (delivery) => delivery.product),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", delivery_1.Delivery)
], Product.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)()
], Product);
//# sourceMappingURL=product.js.map