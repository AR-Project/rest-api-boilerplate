/* eslint-disable no-unused-vars */
export default class AuthenticationRepository {
  async addToken (token: any): Promise<void> {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async checkAvailabilityToken (token: any): Promise<void> {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteToken (token: any): Promise<void> {
    throw new Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}
