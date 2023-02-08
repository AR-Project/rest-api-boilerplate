/* eslint-disable no-unused-vars */
export interface IUserRepository {
  verifyAvailableUsername: (username: any) => Promise<any>
  addUser: (registerUser: any) => Promise<any>
  getPasswordByUsername: (username: any) => Promise<any>
  getIdByUsername: (username: any) => Promise<any>
  changePassword: (username: any, newPassword: any) => Promise<any>
}

export default class UserRepository implements IUserRepository {
  async verifyAvailableUsername (username: any): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async addUser (registerUser: any): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getPasswordByUsername (username: any): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getIdByUsername (username: any): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async changePassword (id: any, newPassword: any): Promise<any> {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}
