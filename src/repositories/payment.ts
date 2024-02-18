import { Payment } from '../models/payment';
import { dataSource } from '../data-source';

export const PaymentRepository = dataSource.getRepository(Payment).extend({});