import {isAuthenticatedUser} from "./auth";
import jwt from "jsonwebtoken";
import User from '../models/users.js';

const mockRequest = () => ({
    headers: {
        authorization: ""
    }
})

const mockNext = jest.fn();

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
})

afterEach(() => {
    jest.restoreAllMocks()
})

describe('Auth middleware', () => {
    it('should throw authorization missing header error', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await isAuthenticatedUser(mockReq, mockRes, mockNext)

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Missing Authorization header with Bearer token"
        })
    });

    it('should throw authentication failed error', async () => {
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.headers.authorization = "Bearer ";

        await isAuthenticatedUser(mockReq, mockRes, mockNext)

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Authentication Failed",
        })

    });

    it('should authenticate user', async () => {
        jest.spyOn(jwt, 'verify').mockResolvedValueOnce({id: 1})
        jest.spyOn(User, 'findById').mockResolvedValueOnce({id: 1, name: 'Jan'})

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.headers.authorization = "Bearer tokenstrings"

        await isAuthenticatedUser(mockReq, mockRes, mockNext)

        expect(mockNext).toBeCalledTimes(1)
    });

    it('should should throw auth failed error of catch block', async () => {
        jest.spyOn(jwt, 'verify').mockResolvedValueOnce({id: 1})
        jest.spyOn(User, 'findById').mockRejectedValueOnce({error: "User authentication failed",})

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.headers.authorization = "Bearer tokenstrings"

        await isAuthenticatedUser(mockReq, mockRes, mockNext)

        expect(mockRes.status).toHaveBeenCalledWith(500)
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "User authentication failed",
        });
    });
})