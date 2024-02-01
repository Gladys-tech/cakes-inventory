import { Order } from '../models/order';
import { dataSource } from '../data-source';

export const OrderRepository = dataSource.getRepository(Order).extend({});
