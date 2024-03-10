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
exports.Shop = exports.ShopType = void 0;
const typeorm_1 = require("typeorm");
const product_1 = require("./product");
const address_1 = require("./address");
const user_1 = require("./user");
var ShopType;
(function (ShopType) {
    ShopType["ONLINE"] = "online";
    ShopType["PHYSICAL"] = "physical";
})(ShopType || (exports.ShopType = ShopType = {}));
let Shop = class Shop {
};
exports.Shop = Shop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Shop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Shop.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Shop.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Shop.prototype, "ownerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Shop.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ShopType }),
    __metadata("design:type", String)
], Shop.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_1.User, (user) => user.shops),
    __metadata("design:type", Array)
], Shop.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_1.Address, (address) => address.shops, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'addressId' }),
    __metadata("design:type", address_1.Address)
], Shop.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => product_1.Product, (product) => product.shops, {
        cascade: ['remove'],
    }),
    __metadata("design:type", Array)
], Shop.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Shop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Shop.prototype, "updatedAt", void 0);
exports.Shop = Shop = __decorate([
    (0, typeorm_1.Entity)()
], Shop);
//# sourceMappingURL=shop.js.map