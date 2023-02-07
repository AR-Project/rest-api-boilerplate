import IdGeneratorAbstract from "../IdGenerator.js"

describe('idGenerator tools interface abstractions', () => {
  it('should should throw error when invoke unimplemented method', () => {
    const idGenerator = new IdGeneratorAbstract()

    expect(() => { idGenerator.generate() }).toThrow('ID_GENERATOR.METHOD_NOT_IMPLEMENTED')
  })
})