import { Request, Response } from 'express';
import { UserRepository } from '../repositories';
import { User } from '../models/user';

class UserService {
    private readonly userRepository: typeof UserRepository;

    constructor() {
        this.userRepository = UserRepository;
    }

    /**
     * Retrieve all users
     */
    public getAll = async (req: Request, res: Response): Promise<User[]> => {
        const users = await this.userRepository.find();
        return users;
    };
}
export default new UserService();
