import { Customer } from '../models/customer';
import { dataSource } from '../data-source';

export const CustomerRepository = dataSource.getRepository(Customer).extend({});
