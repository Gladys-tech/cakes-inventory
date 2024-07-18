import { dataSource } from '../data-source';
import { TopSearchProduct } from '../models/search';

export const TopSearchProductRepository = dataSource
    .getRepository(TopSearchProduct)
    .extend({});
