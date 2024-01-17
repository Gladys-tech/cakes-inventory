import { Request, Response } from 'express';
import { UserRepository } from '../repositories';
import { User } from '../models/user';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { sendPasswordResetEmail } from '../utils/emailUtils';
import { generateJwtToken, verify, verifyResetToken } from '../utils/jwtUtils';
import { sign } from 'jsonwebtoken';
import { MoreThanOrEqual } from 'typeorm';

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
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
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
        const hashedPassword = await hashPassword(userData.password);
        const newUser = this.userRepository.create({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            image: userData.image,
            password: hashedPassword,
            role: userData.role,
            address: userData.address,
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
    public updateUser = async (
        userId: string,
        userData: any
    ): Promise<User | null> => {
        const existingUser = await this.userRepository.findOne({
            where: { id: userId },
        });

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
        const userToDelete = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!userToDelete) {
            return null; // User not found
        }

        await this.userRepository.remove(userToDelete);

        return userToDelete;
    };

    /**
     * Get user by email and password
     */

    public getUserByEmailAndPassword = async (
        email: string,
        password: string
    ): Promise<User | null> => {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    email: email,
                },
            });

            if (user) {
                console.log('Retrieved user:', user);

                if (user.password === null || user.password === undefined) {
                    console.error('User password is missing or null.');
                    return null;
                }

                const isPasswordValid = await comparePasswords(
                    password,
                    user.password
                );

                if (isPasswordValid) {
                    console.log('compared passwords for user:', user);
                    return user;
                } else {
                    console.error('Invalid password.');
                    return null;
                }
            } else {
                console.error('User not found with the provided email.');
                return null;
            }
        } catch (error) {
            console.error('Error during getUserByEmailAndPassword:', error);
            return null;
        }
    };

    /**
     * Update user activation token
     */
    public updateUserActivationToken = async (
        userId: string,
        activationToken: string
    ): Promise<void> => {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (user) {
                user.emailVerificationToken = activationToken;
                await this.userRepository.save(user);
                console.log('Activation token updated for user:', user);
            } else {
                console.error('User not found with the provided userId.');
            }
        } catch (error) {
            console.error('Error during updateUserActivationToken:', error);
        }
    };

    /**
     * Activate user account
     */
    public activateUser = async (userId: string): Promise<void> => {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (user) {
                user.isEmailVerified = true;
                user.emailVerificationToken = null;
                await this.userRepository.save(user);
                console.log('User account activated:', user);
            } else {
                console.error('User not found with the provided userId.');
            }
        } catch (error) {
            console.error('Error during activateUser:', error);
        }
    };

    /**
     * initiate passwordReset by sending a mail
     */

    public initiatePasswordReset = async (email: string): Promise<void> => {
        try {
            const user = await this.userRepository.findOne({
                where: { email: email },
            });

            if (user) {
                const resetToken = generateJwtToken(user);
                const resetTokenExpires = new Date();
                resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour

                // Save the reset token and expiration date in the user's record
                user.resetToken = resetToken;
                user.resetTokenExpires = resetTokenExpires;

                await this.userRepository.save(user);

                // Send the password reset email with the reset token
                await sendPasswordResetEmail(user.email, resetToken);
            } else {
                console.error('User not found with the provided email.');
            }
        } catch (error) {
            console.error('Error during initiatePasswordReset:', error);
        }
    };

    /**
     * reset password after getting the token
     */
    public resetPassword = async (
        token: string,
        newPassword: string
    ): Promise<void> => {
        try {
            // Decode the JWT token to extract the user ID and reset token
            const trimmedToken = token.trim();
            verifyResetToken(trimmedToken);

            const decodedToken: any = verifyResetToken(token);
            console.log('Decoded Token:', decodedToken);

            const user = await this.userRepository.findOne({
                where: {
                    resetToken: token,
                    resetTokenExpires: MoreThanOrEqual(new Date()),
                },
            });

            if (user) {
                // Update the user's password and reset token
                user.password = await hashPassword(newPassword);
                user.resetToken = null;
                user.resetTokenExpires = null;

                await this.userRepository.save(user);

                console.log('Password reset successful for user:', user);
            } else {
                console.error('Invalid or expired reset token.');
            }
        } catch (error) {
            console.error('Error during resetPassword:', error);
        }
    };
}

export default new UserService();
