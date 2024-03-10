"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticateToken = (req, res, next) => {
    console.log('Auth Middleware Executed');
    //   const token = req.header('Authorization');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token without 'Bearer'
    if (!token) {
        console.log('No Token Found');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Received Token:', token); // Add this line to log the token
    try {
        const decoded = (0, jwtUtils_1.verify)(token);
        console.log('Decoded Token Payload:', decoded); // Log decoded payload
        req.user = decoded; // Attach the user information to the request object
        console.log('Token Verified:', decoded);
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=authMiddleware.js.map