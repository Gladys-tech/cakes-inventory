"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const passwordUtils_1 = require("../utils/passwordUtils");
const emailUtils_1 = require("../utils/emailUtils");
const jwtUtils_1 = require("../utils/jwtUtils");
const typeorm_1 = require("typeorm");
class UserService {
    constructor() {
        /**
         * Retrieve all users
         */
        this.getAll = async (req, res) => {
            const users = await this.userRepository.find();
            return users;
        };
        /**
         * Retrieve a user by ID
         */
        this.getUserById = async (userId) => {
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
        this.createUser = async (userData) => {
            const hashedPassword = await (0, passwordUtils_1.hashPassword)(userData.password);
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
        this.updateUser = async (userId, userData) => {
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
        this.deleteUser = async (userId) => {
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
        this.getUserByEmailAndPassword = async (email, password) => {
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
                    const isPasswordValid = await (0, passwordUtils_1.comparePasswords)(password, user.password);
                    if (isPasswordValid) {
                        console.log('compared passwords for user:', user);
                        return user;
                    }
                    else {
                        console.error('Invalid password.');
                        return null;
                    }
                }
                else {
                    console.error('User not found with the provided email.');
                    return null;
                }
            }
            catch (error) {
                console.error('Error during getUserByEmailAndPassword:', error);
                return null;
            }
        };
        /**
         * Update user activation token
         */
        this.updateUserActivationToken = async (userId, activationToken) => {
            try {
                const user = await this.userRepository.findOne({
                    where: { id: userId },
                });
                if (user) {
                    user.emailVerificationToken = activationToken;
                    await this.userRepository.save(user);
                    console.log('Activation token updated for user:', user);
                }
                else {
                    console.error('User not found with the provided userId.');
                }
            }
            catch (error) {
                console.error('Error during updateUserActivationToken:', error);
            }
        };
        /**
         * Activate user account
         */
        this.activateUser = async (userId) => {
            try {
                const user = await this.userRepository.findOne({
                    where: { id: userId },
                });
                if (user) {
                    user.isEmailVerified = true;
                    user.emailVerificationToken = null;
                    await this.userRepository.save(user);
                    console.log('User account activated:', user);
                }
                else {
                    console.error('User not found with the provided userId.');
                }
            }
            catch (error) {
                console.error('Error during activateUser:', error);
            }
        };
        /**
         * initiate passwordReset by sending a mail
         */
        this.initiatePasswordReset = async (email) => {
            try {
                const user = await this.userRepository.findOne({
                    where: { email: email },
                });
                if (user) {
                    const resetToken = (0, jwtUtils_1.generateJwtToken)(user);
                    const resetTokenExpires = new Date();
                    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour
                    // Save the reset token and expiration date in the user's record
                    user.resetToken = resetToken;
                    user.resetTokenExpires = resetTokenExpires;
                    await this.userRepository.save(user);
                    // Send the password reset email with the reset token
                    await (0, emailUtils_1.sendPasswordResetEmail)(user.email, resetToken);
                }
                else {
                    console.error('User not found with the provided email.');
                }
            }
            catch (error) {
                console.error('Error during initiatePasswordReset:', error);
            }
        };
        /**
         * reset password after getting the token
         */
        this.resetPassword = async (token, newPassword) => {
            try {
                // Decode the JWT token to extract the user ID and reset token
                const trimmedToken = token.trim();
                (0, jwtUtils_1.verifyResetToken)(trimmedToken);
                const decodedToken = (0, jwtUtils_1.verifyResetToken)(token);
                console.log('Decoded Token:', decodedToken);
                const user = await this.userRepository.findOne({
                    where: {
                        resetToken: token,
                        resetTokenExpires: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                    },
                });
                if (user) {
                    // Update the user's password and reset token
                    user.password = await (0, passwordUtils_1.hashPassword)(newPassword);
                    user.resetToken = null;
                    user.resetTokenExpires = null;
                    await this.userRepository.save(user);
                    console.log('Password reset successful for user:', user);
                }
                else {
                    console.error('Invalid or expired reset token.');
                }
            }
            catch (error) {
                console.error('Error during resetPassword:', error);
            }
        };
        this.userRepository = repositories_1.UserRepository;
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.js.map