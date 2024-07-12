import { ContactRepository } from '../repositories';
import { Contact } from '../models/contact';

class ContactService {
    private readonly contactRepository: typeof ContactRepository;

    constructor() {
        this.contactRepository = ContactRepository;
    }

    /**
     * Retrieve all contacts
     */
    public getAll = async (): Promise<Contact[]> => {
        return await this.contactRepository.find();
    };

    /**
     * Retrieve a contact by ID
     */
    public getContactById = async (contactId: string): Promise<Contact | null> => {
        const contact = await this.contactRepository.findOne({
            where: { id: contactId },
        });
        return contact || null;
    };

    /**
     * Create a new contact
     */
    public createContact = async (contactData: any): Promise<Contact> => {
        const newContact = this.contactRepository.create({
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            address: contactData.address,
            message: contactData.message,
        });

        return await this.contactRepository.save(newContact);
    };

    /**
     * Update a contact by ID
     */
    public updateContact = async (contactId: string, contactData: any): Promise<Contact | null> => {
        const existingContact = await this.contactRepository.findOne({
            where: { id: contactId },
        });

        if (!existingContact) {
            return null; // Contact not found
        }

        const updatedContact = this.contactRepository.merge(existingContact, contactData);
        await this.contactRepository.save(updatedContact);

        return updatedContact;
    };

    /**
     * Delete a contact by ID
     */
    public deleteContact = async (contactId: string): Promise<Contact | null> => {
        const contactToDelete = await this.contactRepository.findOne({
            where: { id: contactId },
        });

        if (!contactToDelete) {
            return null; // Contact not found
        }

        await this.contactRepository.remove(contactToDelete);

        return contactToDelete;
    };
}

export default new ContactService();
