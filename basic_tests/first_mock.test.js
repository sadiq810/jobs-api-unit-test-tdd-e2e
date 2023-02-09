const crypto = require('crypto')
const {getData} = require("./app");

jest.mock('crypto')

test('Testing Mocking', async() => {
    //crypto.randomBytes.mockResolvedValueOnce('bytes')
    crypto.randomBytes.mockImplementationOnce(() => Promise.resolve('bytesss'))
    let res = await getData();

    console.log(res)

})