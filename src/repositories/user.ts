import { User } from '../models/user';
import { dataSource } from '../data-source';

export const UserRepository = dataSource.getRepository(User).extend({});
