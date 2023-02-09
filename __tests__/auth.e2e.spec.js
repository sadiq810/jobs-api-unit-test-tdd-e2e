import request from 'supertest';
import app from '../app';

import {connectDatabase, closeDatabase} from './db-handler';

beforeAll(async () => {
    await connectDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

beforeEach(() => jest.setTimeout(60000));

describe('Auth (e2e)', () => {
    describe('(POST) - Register User',  () => {
        it('should throw validation error', async () => {
            const response = await request(app).post('/api/v1/register').send({
                name: 'Test user',
                email: 'test@gmail.com'
            });

            //console.log(response.statusCode, response.body.error)
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toMatch(/Please enter all values/);
            expect(response.body.error).toBe("Please enter all values");
        });

        it('should register user', async () => {
            const response = await request(app).post('/api/v1/register').send({
                name: 'Test user',
                email: 'test@gmail.com',
                password: 'abc12345678'
            });

           // console.log(response.statusCode, response.body);

            expect(response.statusCode).toBe(201);
            expect(response.body.token).toBeDefined();
        });

        it('should throw duplicate email error', async () => {
            const response = await request(app).post('/api/v1/register').send({
                name: 'Test user',
                email: 'test@gmail.com',
                password: 'abc12345678'
            });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("Duplicate email");
        });
    });

    describe('(POST) Login User', () => {
        it('should throw missing login credentials error', async () => {
            const response = await request(app).post('/api/v1/login')
                .send({
                    email: '',
                    password: ''
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Please enter email & Password')
        });

        it('should throw invalid credentials error', async () => {
            const response = await request(app).post('/api/v1/login').send({
                email: 'tests@gmail.com',
                password: '234234234234'
            });

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe("Invalid Email or Password")
        });

        it('should throw invalid password error', async () => {
            const response = await request(app).post('/api/v1/login')
                .send({
                    email: 'test@gmail.com',
                    password: '23423423432'
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toMatch(/Invalid Password/)
        });

        it('should login user', async () => {
            const response = await request(app).post('/api/v1/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'abc12345678'
                });

            expect(response.statusCode).toBe(200);
            expect(response.body.token).toBeDefined();
        });
    });

    describe('(404) - Route not found', () => {
        it('should throw route found error', async () => {
            const response = await request(app).post('/api/v1/sdfkj');

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Route not found')

        });
    })
})
