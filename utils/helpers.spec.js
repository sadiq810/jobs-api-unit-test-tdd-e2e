import jwt from "jsonwebtoken";
import  {getJwtToken, sendEmail} from "./helpers";

afterEach(() => {
    jest.restoreAllMocks();
})


jest.mock("nodemailer", () => ({
    createTransport: jest.fn().mockReturnValueOnce({
        sendMail: jest.fn().mockResolvedValueOnce({
            accepted: ["test@gmail.com"]
        })
    })
}))


describe('Utils/Helpers', () => {

    describe('Send Mail', () => {
        it('should send email to user', async () => {
            const response = await sendEmail({
                email: 'test@gmail.com',
                subject: 'password reset',
                message: 'This is test message'
            });

            expect(response).toBeDefined();
            expect(response.accepted).toContain("test@gmail.com")
        });
    })

    describe('JWT Token', () => {
        it('should give jwt token', async () => {
            jest.spyOn(jwt, 'sign').mockResolvedValueOnce('token')

            const token = await getJwtToken('232342342343')

            expect(token).toBeDefined();
            expect(token).toBe('token')
        });
    });

})