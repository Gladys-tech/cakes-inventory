import { Shop } from '../models/shop';
import { dataSource } from '../data-source';

export const ShopRepository = dataSource.getRepository(Shop).extend({});
