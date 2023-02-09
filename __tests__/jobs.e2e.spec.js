import request from 'supertest';
import app from '../app';

import {connectDatabase, closeDatabase} from './db-handler';

let jwtToken = '';
let jobCreated = '';

beforeAll(async () => {
    await connectDatabase();

    const response = await request(app).post('/api/v1/register').send({
        name: 'Test user',
        email: 'test@gmail.com',
        password: 'abc12345678'
    });

    jwtToken = response.body.token;
});

afterAll(async () => {
    await closeDatabase();
});

beforeEach(() => jest.setTimeout(60000));

const newJob = {
    title: 'Node Developer',
    description: 'some description',
    email: 'test@gmail.com',
    address: 'some test address',
    company: 'Knack ltd',
    positions: 2,
    salary: 150000
}

describe('Jobs (e2e)', () => {
   describe('(GET) - Get All Jobs', () => {
       it('should get all jobs', async () => {
           const res = await request(app).get('/api/v1/jobs');

         //  console.log(res.body);
           expect(res.statusCode).toBe(200);
           expect(res.body.jobs).toBeDefined();
           expect(res.body.jobs).toBeInstanceOf(Array)

       });
   });

   describe("(POST) - create new job", () => {
       it('should throw validation error', async function () {
           const res = await request(app).post('/api/v1/job/new')
               .set('Authorization', 'Bearer '+jwtToken)
               .send({
                   title: 'PHP Developer'
               });

           //console.log(jwtToken, res.body)

           expect(res.statusCode).toBe(400);
           expect(res.body.error).toBe('Please enter all values')
       });

       it('should create a new job', async function () {
           const res = await request(app).post('/api/v1/job/new')
               .set('Authorization', 'Bearer '+jwtToken)
               .send(newJob);

          // console.log(res.body)
           jobCreated = res.body.job;

           expect(res.statusCode).toBe(200)
           expect(res.body.job).toBeDefined();
           expect(res.body.job._id).toBeDefined();
           expect(res.body.job).toHaveProperty('_id');
           expect(res.body.job).toMatchObject(newJob)
       });
   });

   describe('(GET) - Get a job by ID', () => {
       it('should get job by id', async function () {
           const response = await request(app).get('/api/v1/job/'+jobCreated._id)

          // console.log(response.body)
           expect(response.statusCode).toBe(200);
           expect(response.body.job._id).toBe(jobCreated._id)
           expect(response.body.job).toMatchObject(newJob)
       });

       it('should throw job not found error', async function () {
           const response = await request(app).get('/api/v1/job/63e4a65fdaa3af2af581faf7')

           expect(response.statusCode).toBe(404);
           expect(response.body.error).toBe('Job not found')
       });

       it('should throw cast error', async function () {
           const response = await request(app).get('/api/v1/job/33')

           expect(response.statusCode).toBe(400);
           expect(response.body.error).toBe('Please enter correct id')
       });
   });

   describe('(PUT) - Update job', () => {
       it('should update the job', async function () {
           const response = await request(app).put('/api/v1/job/'+jobCreated._id)
               .set('Authorization', 'Bearer '+jwtToken)
               .send({title: 'PHP Developer'})

           expect(response.statusCode).toBe(200);
           expect(response.body.job._id).toBe(jobCreated._id)
           expect(response.body.job.title).toBe('PHP Developer')
       });

       it('should throw job not found error', async function () {
           const response = await request(app).put('/api/v1/job/63e4a65fdaa3af2af581faf7')
               .set('Authorization', 'Bearer '+jwtToken)
               .send({title: 'PHP Developer'})

           expect(response.statusCode).toBe(404);
           expect(response.body.error).toBe('Job not found')
       });
   });

   describe('(DELETE) - delete job', () => {
       it('should throw job not found error', async function () {
           const response = await request(app).delete('/api/v1/job/63e4a65fdaa3af2af581faf7')
               .set('Authorization', 'Bearer '+jwtToken)

           expect(response.statusCode).toBe(404);
           expect(response.body.error).toBe('Job not found')
       });

       it('should update the job', async function () {
           const response = await request(app).put('/api/v1/job/'+jobCreated._id)
               .set('Authorization', 'Bearer '+jwtToken)

           expect(response.statusCode).toBe(200);
           expect(response.body.job._id).toBe(jobCreated._id)
       });
   });
});