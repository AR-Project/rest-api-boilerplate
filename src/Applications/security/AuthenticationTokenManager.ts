/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

export interface ITokenPayload {
  id: string
  username: string
  level: string
}
export default class AuthenticationTokenManager {
  async createRefreshToken (payload: ITokenPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async createAccessToken (payload: ITokenPayload): Promise<string> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async verifyRefreshToken (token: string): Promise<ITokenPayload> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }

  async decodePayload (token: string): Promise<ITokenPayload> {
    throw new Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = AuthenticationTokenManager
