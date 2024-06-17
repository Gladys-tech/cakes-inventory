import { Address } from '../models/address';
import { dataSource } from '../data-source';

export const AddressRepository = dataSource.getRepository(Address).extend({});
