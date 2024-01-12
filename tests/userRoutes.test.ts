import supertest from 'supertest';
import express, { Application } from 'express';
import { UserRoutes } from '../src/api/routes';
import { User } from '../src/models/user';

// Create a mock Express app instance for testing
const testApp: Application = express();

// Pass the testApp instance to UserRoutes during the setup
const app: Application = new UserRoutes(testApp).configureRoutes();

describe('User Routes', () => {
    it('should get users', async () => {
        const response = await supertest(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });

    it('should get a user by id', async () => {
        const response = await supertest(app).get('/users/1');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
    });

    it('should create a user', async () => {
        const response = await supertest(app).post('/users').send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            image: 'profile.jpg',
            password: 'password123',
            role: 'user',
            isEmailVerified: false,
            emailVerificationToken: 'verification_token',
            agreeToTerms: true,
            rememberMe: false,
            apiToken: 'api_token',
            resetToken: 'reset_token',
            resetTokenExpires: new Date(),
            // Add other required properties
        });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('CREATED');
        expect(response.body.user).toHaveProperty('id');
    });

    it('should update a user', async () => {
        // Replace '1' with an existing user ID
        const response = await supertest(app).put('/users/1').send({
            firstName: 'UpdatedFirstName',
            // Add other properties to update
        });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body.user).toHaveProperty('id');
        // Add assertions for other properties if needed
    });

    it('should delete a user', async () => {
        // Replace '1' with an existing user ID
        const response = await supertest(app).delete('/users/1');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('OK');
        expect(response.body.message).toContain('deleted');
    });
});
