const crypto = require('crypto')
const {getData} = require("./app");

test('Testing MockImplementation', () => {
    const testFn = jest.fn(() => 'default')
        .mockImplementation(() => 'Second Call')
        .mockImplementation(() => 'Third Call')

   /* console.log(testFn())
    console.log(testFn())*/
})

test('MockImplementation Once', () => {
    const testFn = jest.fn(() => 'Default Once')
        .mockImplementationOnce(() => 'First Call (Once)')
        .mockImplementationOnce(() => 'Second Call (once)')

    /*console.log(testFn());
    console.log(testFn());
    console.log(testFn());*/
})

test('jest.SpyOn()', async () => {
    //jest.spyOn(crypto, 'randomBytes').mockResolvedValueOnce( 'Bytessss')
    jest.spyOn(crypto, 'randomBytes')
        .mockImplementationOnce(() => Promise.resolve("bytes"))

    let res = await getData();

    console.log(res)

    expect(res).toBe('bytes')
})