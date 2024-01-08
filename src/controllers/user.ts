import { Request, Response } from 'express';
import { UserService } from '../services';

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

}

export default new UserController();



