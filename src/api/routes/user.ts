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
        this.app.route('/users').get(UserController.getUsers);

        return this.app;
    }
}
