export interface IIdGenerator{
  generate: () => string
}

export default class IdGenerator implements IIdGenerator {
  generate(): any {
    throw new Error('ID_GENERATOR.METHOD_NOT_IMPLEMENTED')
  }
}