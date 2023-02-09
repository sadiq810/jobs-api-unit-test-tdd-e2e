import Job from '../models/jobs.js';
import {getJobs, newJob, getJob, updateJob, deleteJob} from "./jobsController";

const mockRequest = () => ({
    query: {
        page: 1,
        keyword: ''
    }
});

const mockResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
})

const mockedJobs = [{_id: '123123', title: 'test title'}];
const job = [{title: 'test title'}];

afterEach(() => {
    jest.restoreAllMocks()
});

describe('Get Jobs', () => {
    it('should get list of jobs', async () => {
        jest.spyOn(Job, 'find').mockImplementationOnce(() => ({
            limit: jest.fn().mockReturnThis(),
            skip: jest.fn().mockResolvedValueOnce(mockedJobs),
        }))

        const mockReq = mockRequest();
        const mockRes = mockResponse();

        await getJobs(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            jobs: mockedJobs
        });

        expect(Job.find).toHaveBeenCalledWith({})
    });
});

describe('New Job', () => {
    it('should create new job', async () => {
        jest.spyOn(Job, 'create').mockResolvedValueOnce(mockedJobs[0])

        const mockReq = mockRequest().body = {body: job, user: {id: 1}}
        const mockRes = mockResponse();

        await newJob(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            job: mockedJobs[0]
        });
    });

    it('should throw validation error', async () => {
        jest.spyOn(Job, 'create').mockRejectedValueOnce({name: 'ValidationError'})

        const mockReq = mockRequest().body = {body: job, user: {id: 1}}
        const mockRes = mockResponse();

        await newJob(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter all values",
        });
    });
})

describe('Single Job', () => {
    it('should throw 404 error', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce(null);
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.params = {id: 1};

        await getJob(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Job not found",
        })
    });

    it('should return a job', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce(mockedJobs[0]);
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.params = {id: 1};

        await getJob(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            job: {_id: '123123', title: 'test title'}
        })
    });

    it('should throw cast error', async () => {
        jest.spyOn(Job, 'findById').mockRejectedValueOnce({name: 'CastError'})
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.params = {id: 1};

        await getJob(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Please enter correct id",
        })
    });
})

describe('update job', () => {
    it('should throw job not found error', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce(null);
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.params = {id: 1};

        await updateJob(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Job not found",
        })
    });

    it('should throw unauthorized error', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce({...mockedJobs[0], user: 123});
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.params = {id: 1};
        mockReq.user = {id: 321}

        await updateJob(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "You are not allowed to update this job",
        })
    });

    it('should update the job', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce({...mockedJobs[0], user: 123});
        jest.spyOn(Job, 'findByIdAndUpdate').mockResolvedValueOnce({...mockedJobs[0], user: 123});
        const mockReq = mockRequest();
        const mockRes = mockResponse();

        mockReq.params = {id: 1};
        mockReq.user = {id: "123"}

        await updateJob(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            job: {_id: '123123', title: 'test title', user: 123},
        })
        expect(Job.findByIdAndUpdate).toHaveBeenCalledWith(1, mockReq.body, { new: true })
        expect(Job.findById).toHaveBeenCalledWith(1)
    });
});

describe('Delete Job', () => {
    it('should throw not found error', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce(null);
        const mockReq = mockRequest().params = {params: {id: 1}}
        const mockRes = mockResponse();

        await deleteJob(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Job not found",
        })
    });

    it('should delete the job', async () => {
        jest.spyOn(Job, 'findById').mockResolvedValueOnce(mockedJobs[0]);
        jest.spyOn(Job, 'findByIdAndDelete').mockResolvedValueOnce(mockedJobs[0]);
        const mockReq = mockRequest().params = {params: {id: 1}}
        const mockRes = mockResponse();

        await deleteJob(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            job: mockedJobs[0]
        });

        expect(Job.findById).toHaveBeenCalledWith(1)
        expect(Job.findByIdAndDelete).toHaveBeenCalledWith(1)
    });
})