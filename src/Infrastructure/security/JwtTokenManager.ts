import jwt from 'jsonwebtoken'
import AuthenticationTokenManager, { ITokenPayload } from '../../Applications/security/AuthenticationTokenManager.js'

import InvariantError from '../../Commons/exceptions/InvariantError.js'

export default class JwtTokenManager extends AuthenticationTokenManager {
  override async createAccessToken(payload: ITokenPayload): Promise<string> {
    return jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_KEY as string,
      { expiresIn: `${process.env.ACCCESS_TOKEN_AGE}s` }
    )
  }

  override async createRefreshToken(payload: ITokenPayload): Promise<string> {
    return jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_KEY as string,
      { expiresIn: `${process.env.REFRESH_TOKEN_AGE}s` }

    )
  }

  override async verifyRefreshToken(token: string): Promise<ITokenPayload> {
    try {
      const artifact = jwt.verify(token, process.env.REFRESH_TOKEN_KEY as string) as any
      const payload: ITokenPayload = {
        id: artifact.id,
        username: artifact.username,
        role: artifact.role
      }
      return payload

    } catch (error) {
      throw new InvariantError('refresh token tidak valid')
    }
  }

  override async decodePayload(token: string): Promise<ITokenPayload> {
    const artifact = jwt.decode(token) as any
    const payload: ITokenPayload = {
      id: artifact.id,
      username: artifact.username,
      role: artifact.role
    }
    return payload
  }
}

module.exports = JwtTokenManager
