"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.verify = exports.generateRefreshToken = exports.generateJwtToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const { JWT_TOKEN_SECRET, JWT_TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRATION, } = process.env;
const generateJwtToken = (user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_TOKEN_SECRET, {
        expiresIn: JWT_TOKEN_EXPIRATION,
    });
    return token;
};
exports.generateJwtToken = generateJwtToken;
const generateRefreshToken = (user) => {
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRATION,
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
const verify = (token) => {
    try {
        console.log('Verifying token:', token);
        return jsonwebtoken_1.default.verify(token, JWT_TOKEN_SECRET);
    }
    catch (error) {
        // Handle the error, e.g., invalid token or token expired
        console.error('JWT verification error:', error);
        throw error;
    }
};
exports.verify = verify;
const verifyResetToken = (token) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_TOKEN_SECRET);
        // If the token has an expiration time, you can check it here
        if (decodedToken.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if (decodedToken.exp < currentTime) {
                throw new jsonwebtoken_1.TokenExpiredError('Token expired', new Date(decodedToken.exp * 1000));
            }
        }
        return decodedToken;
    }
    catch (error) {
        console.error('Invalid token:', token);
        // Handle the error, e.g., invalid token or token expired
        console.error('Reset token verification error:', error);
        throw error;
    }
};
exports.verifyResetToken = verifyResetToken;
//# sourceMappingURL=jwtUtils.js.map