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
exports.User = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const soft_deleteable_1 = require("./abstracts/soft-deleteable");
const db_aware_column_1 = require("../utils/db-aware-column");
const generate_entity_id_1 = require("../utils/generate-entity-id");
const address_1 = require("./address"); //importing the address entity here
const shop_1 = require("./shop");
const delivery_1 = require("./delivery");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["GUEST"] = "guest";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
/**
 * @schema user
 *
 * title: User
 *
 * description: User entity
 *
 * x-resourceId: `user`
 *
 * properties:
 *     - id:
 *         type: `string`
 *         description: The auto-generated id of the user.
 *     - firstName:
 *         type: `string`
 *         description: The first name of the user.
 *     - lastName:
 *         type: `string`
 *         description: The last name of the user.
 *     - email:
 *         type: `string`
 *         description: The email address of the user.
 *     - password:
 *         type: `string`
 *         description: The password hash of the user.
 *     - role:
 *         type: `string`
 *         description: The role of the user.
 *     - isEmailVerified:
 *         type: `boolean`
 *         description: Whether the user has verified their email address.
 *  *     - agreeToTerms:
 *         type: `boolean`
 *         description: Whether the user has agreed to terms and conditions.
 *     - isActive:
 *         type: `boolean`
 *         description: Whether the user is active.
 *     - apiToken:
 *          type: `string`
 *          description: The API token of the user for API authentication especially for developers.
 *     - userInvitation:
 *          type: `string`
 *          description: The user invitation id of the user invitation model.
 *     - createdAt:
 *         type: `string`
 *         format: date-time
 *         description: The date the user was created.
 *     - updatedAt:
 *         type: `string`
 *         format: date-time
 *         description: The date the user was last updated.
 *     - deletedAt:
 *        type: `string`
 *        format: date-time
 *        description: The date the user was deleted.
 *     - metadata:
 *        type: `object`
 *        description: Optional key-value map with additional details about the user.
 *        example: { "key": "value" }
 */
let User = class User extends soft_deleteable_1.SoftDeletableEntity {
    beforeInsert() {
        this.id = (0, generate_entity_id_1.generateEntityId)(this.id, 'user');
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, db_aware_column_1.DbAwareColumn)({
        type: 'enum',
        enum: UserRole,
        nullable: true,
        default: UserRole.USER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "agreeToTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], User.prototype, "rememberMe", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "apiToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "resetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "resetTokenExpires", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => address_1.Address, (address) => address.user, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", address_1.Address)
], User.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => delivery_1.Delivery, (delivery) => delivery.user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", delivery_1.Delivery)
], User.prototype, "delivery", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => shop_1.Shop, (shop) => shop.users),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "shops", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "beforeInsert", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.js.map