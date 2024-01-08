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



        return this.app;
    }
}



