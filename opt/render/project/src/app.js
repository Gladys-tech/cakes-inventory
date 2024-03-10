"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = require("./api/routes");
const logger_1 = require("../logger");
const app = (0, express_1.default)();
exports.app = app;
const routes = [];
const limiter = (0, express_rate_limit_1.default)({
    // windowMs: parseInt(process.env.RATE_LIMIT_WINDOW), // Max 15 minutes
    // max: parseInt(process.env.RATE_LIMIT), // limit each IP to 15 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: async (req, res) => {
        const message = 'Too many requests, please try again later...';
        logger_1.Logger.warn(message);
        res.status(429).json({
            status: 'WARNING',
            message,
        });
    },
});
app.use(express_1.default.json());
// CORS
app.use((0, cors_1.default)());
// Helmet
app.use((0, helmet_1.default)());
// Rate limiter
app.use(limiter);
// Routes (add routes to routes array)
routes.push(new routes_1.UserRoutes(app));
routes.push(new routes_1.ShopRoutes(app));
routes.push(new routes_1.ProductRoutes(app));
routes.push(new routes_1.CustomerRoutes(app));
routes.push(new routes_1.OrderRoutes(app));
routes.push(new routes_1.SupplierRoutes(app));
routes.push(new routes_1.PaymentRoutes(app));
routes.push(new routes_1.DeliveryRoutes(app));
// Health Check
app.get('/health', (req, res) => {
    logger_1.Logger.debug('Health Check: OK.');
    res.status(200).json({
        status: 'OK',
        message: 'Server is running. 1',
    });
});
// Unhandled routes
app.all('*', (req, res) => {
    logger_1.Logger.error(`Unhandled route: ${req.url}`);
    res.status(404).json({
        status: 'ERROR',
        message: `Route ${req.originalUrl} not found.`,
    });
});
//# sourceMappingURL=app.js.map