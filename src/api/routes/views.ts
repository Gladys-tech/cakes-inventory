import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { TotalViewsController } from '../../controllers';

export default class TotalViewsRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'TotalViewsRoutes');
    }

    configureRoutes() {
        this.app.route('/total-views').get(TotalViewsController.getTotalViews);
        this.app
            .route('/total-views')
            .post(TotalViewsController.incrementViews);
        return this.app;
    }
}
