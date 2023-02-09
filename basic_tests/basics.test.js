test('Addition', () => {
    expect(2+2).toBe(4)
})

test('null', () => {
    const i = null
    expect.assertions(2)

    expect(i).toBeNull()
    expect(i).toBeDefined()
})

const animals = ['cat', 'dog']

test('Animal Array', () => {
    expect.assertions(5)
    expect(animals).toContain('cat')
    expect(animals).toContain('dog')
    expect(animals).toBeDefined()
    expect(animals).toBeInstanceOf(Array)
    expect(animals).toEqual(['cat', 'dog'])
})

function getData() {
    throw new Error('Not Found!')
}

test('getData', () => {
    expect(() => getData()).toThrow()
    expect(() => getData()).toThrowError()
    expect(() => getData()).toThrowError('Not Found!')
})

const p = undefined;
const j = '4';
const k = NaN

test('not equal test', () => {
    expect(2+4).not.toBe(0)
    expect(p).toBeUndefined()
    expect(j).not.toBeUndefined()
    expect(k).toBeNaN()
})

const n = 9

test('test number matchers', () => {
    expect(n).toEqual(9)
    expect(n).toBeLessThan(88)
    expect(n).toBeGreaterThan(8)
    expect(n).toBeGreaterThanOrEqual(8.9)
    expect(n).toBeLessThanOrEqual(99)
    expect(n).toBe(9)
    expect(n).toBeTruthy()
    expect(0).toBeFalsy()
    expect(0).not.toBeTruthy()
})

test('testing strings', () => {
    expect('match').toMatch('match')
    expect('match').not.toMatch('Match')
})