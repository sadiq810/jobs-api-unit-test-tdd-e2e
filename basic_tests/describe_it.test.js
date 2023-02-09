
beforeAll(() => {
    console.log("BeforeAll")
})

afterAll(() => {
    console.log("After All")
})

beforeEach(() => {
    console.log('BeforeEach')
})

afterEach(() => {
    console.log('AfterEach')
})

describe("auth", () => {
    test('test1', () => {})
    it('test2', () => {})
})

describe('products', () => {
    it("test3", () => {})
    it("test4", () => {})
})