import { dataSource } from '../data-source';
import { Contact } from '../models/contact';

export const ContactRepository = dataSource.getRepository(Contact).extend({});
