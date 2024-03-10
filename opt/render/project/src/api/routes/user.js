"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const routes_config_1 = require("../../common/routes.config");
const controllers_1 = require("../../controllers");
const authMiddleware_1 = require("../../middleware/authMiddleware");
class UserRoutes extends routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'UserRoutes');
    }
    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        this.app.use('/users', authMiddleware_1.authenticateToken);
        // Read
        this.app.route('/users').get(controllers_1.UserController.getUsers);
        this.app.route('/users/:id').get(controllers_1.UserController.getUserById);
        // Create
        this.app.route('/users').post(controllers_1.UserController.createUser);
        // Update
        this.app.route('/users/:id').put(controllers_1.UserController.updateUser);
        // Delete
        this.app.route('/users/:id').delete(controllers_1.UserController.deleteUser);
        // Signup
        this.app
            .route('/signup')
            .post((0, express_validator_1.body)('name').exists().notEmpty(), (0, express_validator_1.body)('email').exists().notEmpty(), (0, express_validator_1.body)('password').exists().notEmpty(), controllers_1.UserController.signup);
        // Login
        this.app
            .route('/login')
            .post((0, express_validator_1.body)('email').exists().notEmpty(), (0, express_validator_1.body)('password').exists().notEmpty(), controllers_1.UserController.login);
        //email activation
        this.app.route('/activate/:token').get(controllers_1.UserController.activateAccount);
        //initiate passwordReset
        this.app
            .route('/reset-password')
            .post((0, express_validator_1.body)('email').exists().notEmpty(), controllers_1.UserController.initiatePasswordReset);
        //reset password
        this.app
            .route('/reset-password/:token')
            .post((0, express_validator_1.body)('password').exists().notEmpty(), controllers_1.UserController.resetPassword);
        return this.app;
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=user.js.map