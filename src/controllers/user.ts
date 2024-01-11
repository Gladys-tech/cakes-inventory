import { Request, Response } from 'express';
import { UserService } from '../services';
import { generateJwtToken } from '../utils/jwtUtils';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { sendWelcomeEmail, sendAccountActivationEmail } from '../utils/emailUtils';


class UserController {
    //getting all users
    public getUsers = async (req: Request, res: Response) => {
        const users = await UserService.getAll(req, res);

        if (!users) {
            return res.status(404).send({
                status: 'NOT_FOUND',
                message: `User not found.`,
            });
        }
        res.status(200).json({
            status: 'OK',
            users,
        });
    };

    // getting user by id
    public getUserById = async (req: Request, res: Response) => {
        const userId = req.params.id;

        try {
            const user = await UserService.getUserById(userId);

            if (!user) {
                return res.status(404).send({
                    status: 'NOT_FOUND',
                    message: `User not found with id: ${userId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                user,
            });
        } catch (error) {
            console.error('Error retrieving user by ID:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error retrieving user by ID.',
            });
        }
    };

    // creating a user
    public createUser = async (req: Request, res: Response) => {
        const userData = req.body;

        try {
            const newUser = await UserService.createUser(userData);

            res.status(201).json({
                status: 'CREATED',
                user: newUser,
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating user.',
            });
        }
    };

    // updating a user
    public updateUser = async (req: Request, res: Response) => {
        const userId = req.params.id;
        const userData = req.body;

        try {
            const updatedUser = await UserService.updateUser(userId, userData);

            if (!updatedUser) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `User not found with id: ${userId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                user: updatedUser,
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error updating user.',
            });
        }
    };

    // delete a user
    public deleteUser = async (req: Request, res: Response) => {
        const userId = req.params.id;

        try {
            const deletedUser = await UserService.deleteUser(userId);

            if (!deletedUser) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `User not found with id: ${userId}`,
                });
            }

            res.status(200).json({
                status: 'OK',
                message: `User with id ${userId} has been deleted.`,
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error deleting user.',
            });
        }
    };


    // user signup
    public signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            const hashedPassword = await hashPassword(password);

            const newUser = await UserService.createUser({
                name,
                email: email,
                password: hashedPassword,
            });

            // Send welcome email
            // await sendWelcomeEmail(newUser.email);

            res.status(201).json({
                status: 'CREATED',
                user: newUser,
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error creating user.',
            });
        }
    };

    // user login
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await UserService.getUserByEmail(email);

            if (!user) {
                res.status(401).json({
                    status: 'UNAUTHORIZED',
                    message: 'User not found with the provided email.',
                });
                return;
            }

            if (!user.password) {
                // Handle missing password
                res.status(401).json({
                    status: 'UNAUTHORIZED',
                    message: 'User password is not available.',
                });
                return;
            }

            console.log('password:', password);

            const userPassword = user.password;

            if (!userPassword) {
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'User password is not available.',
                });
                return;
            }

            const isPasswordValid = await comparePasswords(password, userPassword);

            if (!isPasswordValid) {
                res.status(401).json({
                    status: 'UNAUTHORIZED',
                    message: 'Invalid password.',
                });
                return;
            }

            const token = generateJwtToken(user);

            res.status(200).json({
                status: 'OK',
                token,
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({
                status: 'INTERNAL_SERVER_ERROR',
                message: 'Error during login.',
            });
        }
    };


}

export default new UserController();
