import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { TopSearchProductController } from '../../controllers';

export default class TopSearchProductRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'TopSearchProductRoutes');
    }

    configureRoutes() {
        this.app.route('/top-search-products').get(TopSearchProductController.getTopSearchProducts);
        this.app.route('/top-search-products').post(TopSearchProductController.addTopSearchProduct);
        return this.app;
    }
}
