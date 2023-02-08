/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
export interface IPasswordHash {
  hash: (password: string) => Promise<any>
  comparePassword: (plain: any, encrypted: string) => Promise<any>
}

export default class PasswordHash implements IPasswordHash {
  async hash (password: string): Promise<any> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  }

  async comparePassword (plain: string, encrypted: string): Promise<any> {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  }
}
