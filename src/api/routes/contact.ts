import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/routes.config';
import { ContactController } from '../../controllers';
import { authenticateToken } from '../../middleware/authMiddleware';

export default class ContactRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'ContactRoutes');
    }

    configureRoutes() {
        // Apply authenticateToken middleware to protect these routes
        // this.app.use('/contacts', authenticateToken);

        // Read
        this.app.route('/contacts').get(ContactController.getContacts);
        this.app.route('/contacts/:id').get(ContactController.getContactById);

        // Create
        this.app.route('/contacts').post(ContactController.createContact);

        // Update
        this.app.route('/contacts/:id').put(ContactController.updateContact);

        // Delete
        this.app.route('/contacts/:id').delete(ContactController.deleteContact);

        return this.app;
    }
}
