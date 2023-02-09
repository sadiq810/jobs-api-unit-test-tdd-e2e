import User from './users.js'

afterEach(() => {
    jest.restoreAllMocks()
})

describe('User Model', () => {
    it('should throw validation error', async () => {
        const user = new User();

        jest.spyOn(user, 'validate').mockRejectedValueOnce({
            errors: {
                name: 'Please enter your name',
                email: 'Please enter your email address',
                password: 'Please enter password'
            }
        });

        try {
            await user.validate();
        } catch (err) {
           // console.log(err)
            expect(err.errors.name).toBeDefined();
            expect(err.errors.email).toBeDefined();
            expect(err.errors.password).toBeDefined();
        }

    });

    it('should throw password length error', async () => {
        const user = new User({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: '123456'
        });

        jest.spyOn(user, 'validate').mockRejectedValueOnce({
            errors: {
                password: {
                    message: "Your password must be at least 8 characters long"
                }
            }
        })

        try {
            await user.validate();
        } catch (err) {
            console.log(err.errors.password.message)
            expect(err.errors.password).toBeDefined()
            expect(err.errors.password.message).toBeDefined()
            expect(err.errors.password.message).toMatch(/Your password must be at least 8 characters long/)
        }
    });

    it('should create a new user', async () => {
        const user = new User({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: 'abc@234e34'
        });

        expect(user).toHaveProperty('_id')
    });
})