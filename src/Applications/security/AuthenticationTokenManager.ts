/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
export interface ITokenPayload {
  id: string
  username: string
  role: string
}

export default interface IAuthenticationTokenManager {
  createRefreshToken: (payload: ITokenPayload) => Promise<string>
  createAccessToken: (payload: ITokenPayload) => Promise<string>
  verifyRefreshToken: (token: string) => Promise<ITokenPayload>
  decodePayload: (token: string) => Promise<ITokenPayload>
}
