import Job from './jobs.js';
import User from "./users";

describe('Job model', () => {
    it('should throw validation errors', async () => {
        const job = new Job({})

        jest.spyOn(job, 'validate').mockRejectedValueOnce({
            errors: {
                title: "Please enter Job title.",
                description: "Please enter Job description.",
                email: "Please enter email",
                address: "Please add an address.",
                company: "Please add Company name.",
                industry: "Please enter industry for this job.",
                salary: "Please enter expected salary for this job."
            }
        });

        try {
            await job.validate()
        } catch (err) {
           // console.log(err.errors);e
            expect(err.errors.title).toBeDefined();
            expect(err.errors.description).toBeDefined();
            expect(err.errors.email).toBeDefined();
            expect(err.errors.address).toBeDefined();
            expect(err.errors.company).toBeDefined();
            expect(err.errors.industry).toBeDefined();
            expect(err.errors.salary).toBeDefined();
        }
    });

    it('should create a new job', async () => {
        const user = new User({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: 'abc@234e34'
        });

        const job = new Job({
            title: 'Test Job',
            description: 'Test Description',
            email: 'test@gmail.com',
            address: 'some test address',
            company: 'Test company',
            industry: 'Business',
            salary: 1234,
            user: user
        });

       // console.log(job)

        expect(job).toHaveProperty('_id')
    });

    it('should throw error for exceeding job title limit', async () => {
        const user = new User({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: 'abc@234e34'
        });

        const job = new Job({
            title: 'Test Job',
            description: 'Test Description',
            email: 'test@gmail.com',
            address: 'some test address',
            company: 'Test company',
            industry: 'Business',
            salary: 1234,
            user: user
        });

       jest.spyOn(job, 'validate').mockRejectedValueOnce({
           errors: {
               title: "Job title can not exceed 100 characters."
           }
       })

        try {
           await job.validate()
        } catch (err) {
           expect(err.errors.title).toMatch(/Job title can not exceed 100 characters./)
        }
    });

    it('should throw error for select incorrect industry type', async () => {
        const user = new User({
            name: 'Ali',
            email: 'ali@gmail.com',
            password: 'abc@234e34'
        });

        const job = new Job({
            title: 'Test Job',
            description: 'Test Description',
            email: 'test@gmail.com',
            address: 'some test address',
            company: 'Test company',
            industry: 'Businesss',
            salary: 1234,
            user: user
        });

       jest.spyOn(job, 'validate').mockRejectedValueOnce({
           errors: {
               industry: "Please select correct options for industry."
           }
       })

        try {
           await job.validate()
        } catch (err) {
           expect(err.errors.industry).toMatch(/Please select correct options for industry./)
        }
    });
})