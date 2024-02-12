import { Supplier } from '../models/supplier';
import { dataSource } from '../data-source';

export const SupplierRepository = dataSource.getRepository(Supplier).extend({});
