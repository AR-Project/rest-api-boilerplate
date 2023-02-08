import AuthenticationTokenManager, { ITokenPayload } from '../../Applications/security/AuthenticationTokenManager.js'
import InvariantError from '../../Commons/exceptions/InvariantError.js'
import jwt from 'jsonwebtoken'

export default class JwtTokenManager extends AuthenticationTokenManager {
  override async createAccessToken (payload: ITokenPayload): Promise<string> {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY as string)
  }

  override async createRefreshToken (payload: ITokenPayload): Promise<string> {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY as string)
  }

  override async verifyRefreshToken (token: string): Promise<ITokenPayload> {
    try {
      const artifact = jwt.verify(token, process.env.REFRESH_TOKEN_KEY as string) as any
      const payload: ITokenPayload = {
        id: artifact.id,
        username: artifact.username,
        level: artifact.level
      }
      return payload

    } catch (error) {
      throw new InvariantError('refresh token tidak valid')
    }
  }

  override async decodePayload (token: string): Promise<ITokenPayload> {
    const artifact = jwt.decode(token) as any
    const payload: ITokenPayload = {
      id: artifact.id,
      username: artifact.username,
      level: artifact.level
    }
    return payload
  }
}

module.exports = JwtTokenManager
