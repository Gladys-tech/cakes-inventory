"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const comparePasswords = async (password, hashedPassword) => {
    try {
        const isPasswordValid = await bcrypt_1.default.compare(password, hashedPassword);
        console.log('Password Comparison:', isPasswordValid);
        return isPasswordValid;
    }
    catch (error) {
        console.error('Error during password comparison:', error);
        return false;
    }
};
exports.comparePasswords = comparePasswords;
//# sourceMappingURL=passwordUtils.js.map