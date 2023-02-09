import {registerUser, loginUser} from "./authController";

import bcrypt from 'bcryptjs'
import User from '../models/users.js'

const mockRequest = () => ({
    body: {
        name: 'Ali',
        email: 'ali@gmail.com',
        password: '12345678'
    }
});

const mockedUser = {
    _id: 'w3rwe234234234234',
    name: 'Ali',
    email: 'ali@gmail.com',
    password: 'passwordHashed'
}

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
})

const userLogin = {
    email: 'ali@gmail.com',
    password: '12345678'
}

jest.mock('../utils/helpers.js', () => ({
    //getJwtToken: jest.fn().mockResolvedValue('jwt_token')
    getJwtToken: jest.fn(() => 'jwt_token')
}))

/*jest.mock('../utils/s3Service.js', () => ({
    upload: jest.fn().mockResolvedValueOnce('image_url')
}))*/

afterEach(() => {
    // restore all mocks created with spyOn, to its original values.
    jest.restoreAllMocks()
})

describe('User Registration',  () => {
    it('Should throw validation errors.', async () => {
        const mockReq = mockRequest().body = {body: {}};
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter all values"
        })
    })

    it('Should return token', async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('passwordHashed')
        jest.spyOn(User, 'create').mockResolvedValueOnce(mockedUser)

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await registerUser(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            token: 'jwt_token'
        });
        expect(bcrypt.hash).toHaveBeenCalledWith('12345678', 10)
        expect(User.create).toHaveBeenCalledWith({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: 'passwordHashed'
        })
    })

    it('Should throw duplicate email error', async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword')
        jest.spyOn(User, 'create').mockRejectedValueOnce({code: 11000})

        const mockReq = mockRequest()
        const mockRes = mockResponse()

        await registerUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Duplicate email"
        })
    });
});

describe('User Login', () => {
   it('Should throw validation error', async () => {
       const mockReq = mockRequest().body = {body: {}};
       const mockRes = mockResponse();

       await loginUser(mockReq, mockRes);

       expect(mockRes.status).toHaveBeenCalledWith(400);
       expect(mockRes.json).toHaveBeenCalledWith({
           error: "Please enter email & Password",
       })
   }) ;

   it('Should throw error for Invalid email or password', async () => {
      jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
          select: jest.fn().mockResolvedValueOnce(null)
      }));

      const mockReq = mockRequest().body = {body: userLogin};
      const mockRes = mockResponse();

      await loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
          error: "Invalid Email or Password",
      })
   });

   it('Should throw invalid password error', async () => {
       jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
           select: jest.fn().mockResolvedValueOnce(mockedUser)
       }));

       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(null);

       const mockReq = mockRequest().body = {body: userLogin};
       const mockRes = mockResponse();

       await loginUser(mockReq, mockRes);

       expect(mockRes.status).toHaveBeenCalledWith(401);
       expect(mockRes.json).toHaveBeenCalledWith({
           error: 'Invalid Password',
       })
   });

   it('Should return token', async() => {
       jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
           select: jest.fn().mockResolvedValueOnce(mockedUser)
       }))

       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

       const mockReq = mockRequest().body = {body: userLogin}
       const mockRes = mockResponse()

       await loginUser(mockReq, mockRes)

       expect(mockRes.status).toHaveBeenCalledWith(200)
       expect(mockRes.json).toHaveBeenCalledWith({
           token: 'jwt_token'
       })
   })

   it('Should throw login error', async() => {
       jest.spyOn(User, 'findOne').mockImplementationOnce(() => ({
           select: jest.fn().mockRejectedValueOnce(500)
       }))

       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)

       const mockReq = mockRequest().body = {body: userLogin}
       const mockRes = mockResponse()

       await loginUser(mockReq, mockRes)

       expect(mockRes.status).toHaveBeenCalledWith(500)
       expect(mockRes.json).toHaveBeenCalledWith({
           error: "Error while loggin in",
       })
   })
});
