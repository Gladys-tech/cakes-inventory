import { Product } from '../models/product';
import { dataSource } from '../data-source';

export const ProductRepository = dataSource.getRepository(Product).extend({});
