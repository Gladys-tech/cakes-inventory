import multer from 'multer';

import { Application } from 'express';
import { body } from 'express-validator';
import { CommonRoutesConfig } from '../../common/routes.config';
import { UserController } from '../../controllers';

export default class UserRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UserRoutes');
    }

    configureRoutes() {
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

        return this.app;
    }
}
