import { Request, Response } from 'express';
import { ContactService } from '../services';

class ContactController {
    // Get all contacts
    public getContacts = async (req: Request, res: Response) => {
        try {
            const contacts = await ContactService.getAll();

            if (!contacts) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: 'Contacts not found.',
                });
            }
            res.status(200).json({
                status: 'OK',
                contacts,
            });
        } catch (error) {
            console.error('Error retrieving contacts:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving contacts.',
            });
        }
    };

    // Get contact by ID
    public getContactById = async (req: Request, res: Response) => {
        const contactId = req.params.id;

        try {
            const contact = await ContactService.getContactById(contactId);

            if (!contact) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: `Contact not found with id: ${contactId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                contact,
            });
        } catch (error) {
            console.error('Error retrieving contact by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving contact by ID.',
            });
        }
    };

    // Create a new contact
    public createContact = async (req: Request, res: Response) => {
        const contactData = req.body;

        try {
            const newContact = await ContactService.createContact(contactData);

            res.status(201).json({
                status: 'CREATED',
                contact: newContact,
            });
        } catch (error) {
            console.error('Error creating contact:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating contact.',
            });
        }
    };

    // Update a contact
    public updateContact = async (req: Request, res: Response) => {
        const contactId = req.params.id;
        const contactData = req.body;

        try {
            const updatedContact = await ContactService.updateContact(contactId, contactData);

            if (!updatedContact) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Contact not found with id: ${contactId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                contact: updatedContact,
            });
        } catch (error) {
            console.error('Error updating contact:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating contact.',
            });
        }
    };

    // Delete a contact
    public deleteContact = async (req: Request, res: Response) => {
        const contactId = req.params.id;

        try {
            const deletedContact = await ContactService.deleteContact(contactId);

            if (!deletedContact) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `Contact not found with id: ${contactId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                message: `Contact with id ${contactId} has been deleted.`,
            });
        } catch (error) {
            console.error('Error deleting contact:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting contact.',
            });
        }
    };
}

export default new ContactController();
