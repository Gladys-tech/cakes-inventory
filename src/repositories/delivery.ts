import { Delivery } from '../models/delivery';
import { dataSource } from '../data-source';

export const DeliveryRepository = dataSource.getRepository(Delivery).extend({});
