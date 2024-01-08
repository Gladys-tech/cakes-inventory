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



    /**
     * Retrieve a user by ID
     */
    public getUserById = async (userId: string): Promise<User | null> => {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        return user || null;
    };

   

    /**
     * Create a new user
     */
    // public createUser = async (userData: any): Promise<User> => {
    //     const newUser = this.userRepository.create(userData);
    //     await this.userRepository.save(newUser);
    //     return newUser;
    // };
    public createUser = async (userData: any): Promise<User> => {
        const newUser = this.userRepository.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            image: userData.image,
            password: userData.password,
            role: userData.role,
            isEmailVerified: userData.isEmailVerified,
            emailVerificationToken: userData.emailVerificationToken,
            agreeToTerms: userData.agreeToTerms,
            rememberMe: userData.rememberMe,
            apiToken: userData.apiToken,
            resetToken: userData.resetToken,
            resetTokenExpires: userData.resetTokenExpires,
        });
    
        await this.userRepository.save(newUser);
    
        return newUser;
    };
    


     /**
     * Update a user by ID
     */
     public updateUser = async (userId: string, userData: any): Promise<User | null> => {
        const existingUser = await this.userRepository.findOne({ where: { id: userId } });

        if (!existingUser) {
            return null; // User not found
        }

        const updatedUser = this.userRepository.merge(existingUser, userData);
        await this.userRepository.save(updatedUser);

        return updatedUser;
    };



    /**
     * Delete a user by ID
     */
    public deleteUser = async (userId: string): Promise<User | null> => {
        const userToDelete = await this.userRepository.findOne({ where: { id: userId } });

        if (!userToDelete) {
            return null; // User not found
        }

        await this.userRepository.remove(userToDelete);

        return userToDelete;
    };
}


export default new UserService();
