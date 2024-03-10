"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const jwtUtils_1 = require("../utils/jwtUtils");
const jwtUtils_2 = require("../utils/jwtUtils");
const emailUtils_1 = require("../utils/emailUtils");
class UserController {
    constructor() {
        //getting all users
        this.getUsers = async (req, res) => {
            const users = await services_1.UserService.getAll(req, res);
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
        this.getUserById = async (req, res) => {
            const userId = req.params.id;
            try {
                const user = await services_1.UserService.getUserById(userId);
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
            }
            catch (error) {
                console.error('Error retrieving user by ID:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error retrieving user by ID.',
                });
            }
        };
        // creating a user
        this.createUser = async (req, res) => {
            const userData = req.body;
            try {
                const newUser = await services_1.UserService.createUser(userData);
                res.status(201).json({
                    status: 'CREATED',
                    user: newUser,
                });
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating user.',
                });
            }
        };
        // updating a user
        this.updateUser = async (req, res) => {
            const userId = req.params.id;
            const userData = req.body;
            try {
                const updatedUser = await services_1.UserService.updateUser(userId, userData);
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
            }
            catch (error) {
                console.error('Error updating user:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error updating user.',
                });
            }
        };
        // delete a user
        this.deleteUser = async (req, res) => {
            const userId = req.params.id;
            try {
                const deletedUser = await services_1.UserService.deleteUser(userId);
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
            }
            catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error deleting user.',
                });
            }
        };
        // user signup
        this.signup = async (req, res) => {
            try {
                const { firstName, lastName, email, password, role, isEmailVerified, agreeToTerms, address, } = req.body;
                const newUser = await services_1.UserService.createUser({
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    isEmailVerified,
                    agreeToTerms,
                    address,
                });
                // Generate an activation token
                const activationToken = (0, jwtUtils_1.generateJwtToken)(newUser);
                // Save the activation token to the user record
                await services_1.UserService.updateUserActivationToken(newUser.id, activationToken);
                // Send account activation email with the activation token
                await (0, emailUtils_1.sendAccountActivationEmail)(newUser.email, activationToken);
                // Send account activation  email
                // await sendAccountActivationEmail(newUser.email);
                res.status(201).json({
                    status: 'CREATED',
                    user: newUser,
                });
            }
            catch (error) {
                console.error('Error creating user:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error creating user.',
                });
            }
        };
        // user login
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                const authUser = await services_1.UserService.getUserByEmailAndPassword(email, password);
                if (!authUser) {
                    return res.status(401).json({
                        status: 'UNAUTHORIZED',
                        message: 'Invalid email or password.',
                    });
                }
                const token = (0, jwtUtils_1.generateJwtToken)(authUser);
                res.status(200).json({
                    status: 'OK',
                    message: 'Login successful',
                    token,
                });
                await (0, emailUtils_1.sendWelcomeEmail)(email);
            }
            catch (error) {
                console.error('Error during login:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error during login.',
                });
            }
        };
        // activate account after signup
        this.activateAccount = async (req, res) => {
            try {
                const { token } = req.params;
                // Verify and decode the activation token
                const decodedToken = (0, jwtUtils_2.verify)(token);
                // Update user's isEmailVerified status
                await services_1.UserService.activateUser(decodedToken.userId);
                res.status(200).json({
                    status: 'OK',
                    message: 'Account activated successfully.',
                });
            }
            catch (error) {
                console.error('Error activating account:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error activating account.',
                });
            }
        };
        // initiate password reset
        this.initiatePasswordReset = async (req, res) => {
            try {
                const { email } = req.body;
                await services_1.UserService.initiatePasswordReset(email);
                res.status(200).json({
                    status: 'OK',
                    message: 'Password reset initiated. Check your email for further instructions.',
                });
            }
            catch (error) {
                console.error('Error during initiatePasswordReset:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error initiating password reset.',
                });
            }
        };
        //reset password
        this.resetPassword = async (req, res) => {
            try {
                const token = req.params.token;
                const decodedToken = decodeURIComponent(token);
                const { password } = req.body;
                await services_1.UserService.resetPassword(token, password);
                console.log('Received token:', decodedToken);
                res.status(200).json({
                    status: 'OK',
                    message: 'Password reset successful.',
                });
            }
            catch (error) {
                console.error('Error during resetPassword:', error);
                res.status(500).json({
                    status: 'INTERNAL_SERVER_ERROR',
                    message: 'Error resetting password.',
                });
            }
        };
        // ...
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.js.map