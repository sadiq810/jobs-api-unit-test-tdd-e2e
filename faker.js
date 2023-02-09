import Job from './models/jobs.js';
import User from './models/users.js';
import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";
import connectDatabase from "./config/database.js";
import * as dotenv from 'dotenv'
dotenv.config()

const password = await bcrypt.hash('admin123', 10);
// Setting up config.env file variables
//dotenv.config({ path: "./config/config.env" });

// Connecting to databse
connectDatabase();

async function newJob(data) {
    Job.create(data);
}
async function newUser(data) {
    return User.create(data);
}

for (let i = 0; i < 1000; i ++) {
    let user = await newUser({
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: password,
        createdAt: faker.date.past(),
    });

    await newJob({
        title: faker.lorem.words(4),
        description: faker.lorem.sentences(),
        email: faker.internet.email(),
        address: faker.address.secondaryAddress(),
        company: faker.company.name(),
        industry: 'Business',
        positions: 1,
        salary: faker.finance.amount(),
        postingDate: faker.date.past(),
        user: user
    });

    console.info('Record Created: '+i);
}

console.info('All is done!')
process.exit(0);