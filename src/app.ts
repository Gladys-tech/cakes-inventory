require('dotenv').config();
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { CommonRoutesConfig } from './common/routes.config';
import {
    ContactRoutes,
    CustomerRoutes,
    DeliveryRoutes,
    OrderRoutes,
    PaymentRoutes,
    ProductRoutes,
    ShopRoutes,
    SupplierRoutes,
    UserRoutes,
} from './api/routes';
import { Logger } from '../logger';

const app: Application = express();
const routes: Array<CommonRoutesConfig> = [];
const limiter = rateLimit({
    // windowMs: parseInt(process.env.RATE_LIMIT_WINDOW), // Max 15 minutes
    // max: parseInt(process.env.RATE_LIMIT), // limit each IP to 15 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 900, // 900 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: async (req: Request, res: Response) => {
        const message = 'Too many requests, please try again later...';
        Logger.warn(message);
        res.status(429).json({
            status: 'WARNING',
            message,
        });
    },
});

app.use(express.json());

// CORS
// app.use(cors());

// Enable CORS with specific origin
app.use(
    cors({
        // origin: 'http://localhost:3000', // Allow requests from frontend running on port 3000
        origin: '*',
        credentials: true, // Include cookies in CORS requests if needed
    })
);

// const allowedOrigins = ['http://localhost:3000', 'http://your-other-allowed-origin.com'];

// app.use(
//     cors({
//         origin: (origin, callback) => {
//             if (!origin || allowedOrigins.includes(origin)) {
//                 callback(null, true);
//             } else {
//                 callback(new Error('Not allowed by CORS'));
//             }
//         },
//         credentials: true, // Include cookies in CORS requests if needed
//     })
// );

// Helmet
app.use(helmet());

// Rate limiter
app.use(limiter);

// Routes (add routes to routes array)
routes.push(new UserRoutes(app));
routes.push(new ShopRoutes(app));
routes.push(new ProductRoutes(app));
routes.push(new CustomerRoutes(app));
routes.push(new OrderRoutes(app));
routes.push(new SupplierRoutes(app));
routes.push(new PaymentRoutes(app));
routes.push(new DeliveryRoutes(app));
routes.push(new ContactRoutes(app));

// Health Check
app.get('/health', (req: Request, res: Response) => {
    Logger.debug('Health Check: OK.');
    res.status(200).json({
        status: 'OK',
        message: 'Server is running. 1',
    });
});

// Unhandled routes
app.all('*', (req: Request, res: Response) => {
    Logger.error(`Unhandled route: ${req.url}`);
    res.status(404).json({
        status: 'ERROR',
        message: `Route ${req.originalUrl} not found.`,
    });
});

export { app };
