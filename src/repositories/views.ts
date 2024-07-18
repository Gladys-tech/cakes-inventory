import { dataSource } from '../data-source';
import { TotalViews } from '../models/views';

export const TotalViewsRepository = dataSource
    .getRepository(TotalViews)
    .extend({});
