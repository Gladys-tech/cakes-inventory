import { dataSource } from '../data-source';
import { Visitor } from '../models/visitor';

export const VisitorRepository = dataSource.getRepository(Visitor).extend({});
