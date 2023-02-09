import {registerUser, loginUser} from "./authController";
import bcrypt from 'bcryptjs';
import User from '../models/users.js';

jest.mock('../utils/helpers.js', () => ({
    getJwtToken: jest.fn(() => 'jwt_token')
}))

const mockRequest = () => {
    return {
        body: {
            name: 'Test User',
            email: 'test@gamil.com',
            password: 'test12345'
        }
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

const mockUser = {
    _id: '63db99e1489559734cb6063a',
    name: 'Test User',
    email: 'test@gamil.com',
    password: 'hashedPassword'
}

afterEach(() => {
    // restore all mocks created with spyOn, to its original values.
    jest.restoreAllMocks()
})

const userLogin = {
    email: 'test@gmail.com',
    password: '12345678'
}

describe('Register User', () => {
    it('Should register user', async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
        jest.spyOn(User, 'create').mockResolvedValueOnce(mockUser)

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(201)
        expect(mockRes.json).toHaveBeenCalledWith({token: 'jwt_token'})
        expect(bcrypt.hash).toHaveBeenCalledWith('test12345', 10)
        expect(User.create).toHaveBeenCalledWith({
            name: 'Test User',
            email: 'test@gamil.com',
            password: 'hashedPassword'
        })
    });

    it("should throw validation error", async () => {
        const mockReq = (mockRequest().body = {body: {}})
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter all values",
        })
    });

    it("Should throw duplicate email entered error", async() => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword');
        jest.spyOn(User, 'create').mockRejectedValueOnce({code: 11000});

        const mockReq = mockRequest()
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Duplicate email",
        })
    })
})

describe('Login user', () => {
    it('Should throw missing email or password error', async () => {
        const mockReq = mockRequest().body = {body: {}};
        const mockRes = mockResponse();

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter email & Password",
        })
    });

    it('Should throw invalid email error', async () =>{
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(null)
        }))

        const mockReq = mockRequest().body = {body: userLogin};
        const mockRes = mockResponse();

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Email or Password",
        })
    })

    it('Should throw invalid password error', async () =>{
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(mockUser)
        }))

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

        const mockReq = mockRequest().body = {body: userLogin};
        const mockRes = mockResponse();

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Invalid Password",
        })
    })

    it('Should return token', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
            select: jest.fn().mockResolvedValueOnce(mockUser)
        }));

        jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

        const mockReq = mockRequest().body = {body: userLogin};
        const mockRes = mockResponse();

        await loginUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            token: 'jwt_token',
        })
    })
});