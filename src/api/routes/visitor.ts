import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { VisitorController } from '../../controllers';

export default class VisitorRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'VisitorRoutes');
    }

    configureRoutes() {
        this.app.route('/visitors').get(VisitorController.getVisitors);
        this.app.route('/visitors').post(VisitorController.addVisitor);
        return this.app;
    }
}
