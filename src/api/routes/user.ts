import multer from 'multer';
import { Application } from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../../common/routes.config';
import { UserController } from '../../controllers';
import { authenticateToken } from '../../middleware/authMiddleware';

export default class UserRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UserRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        this.app.use('/users', authenticateToken);

        // Read
        this.app.route('/users').get(UserController.getUsers);
        this.app.route('/users/:id').get(UserController.getUserById);

        // Create
        this.app.route('/users').post(UserController.createUser);

        // Update
        this.app.route('/users/:id').put(UserController.updateUser);

        // Delete
        this.app.route('/users/:id').delete(UserController.deleteUser);

        // Signup
        this.app
            .route('/signup')
            .post(
                body('name').exists().notEmpty(),
                body('email').exists().notEmpty(),
                body('password').exists().notEmpty(),
                UserController.signup
            );

        // Login
        this.app
            .route('/login')
            .post(
                body('email').exists().notEmpty(),
                body('password').exists().notEmpty(),
                UserController.login
            );

        //email activation
        this.app.route('/activate/:token').get(UserController.activateAccount);

        //initiate passwordReset
        this.app
            .route('/reset-password')
            .post(
                body('email').exists().notEmpty(),
                UserController.initiatePasswordReset
            );

        //reset password
        this.app
            .route('/reset-password/:token')
            .post(
                body('password').exists().notEmpty(),
                UserController.resetPassword
            );

        return this.app;
    }
}
