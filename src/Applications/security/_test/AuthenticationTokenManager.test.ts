import AuthenticationTokenManager, { type ITokenPayload } from '../AuthenticationTokenManager.js'

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager()
    const abstractPayload: ITokenPayload = {
      id: 'user-123',
      username: 'username',
      level: 'base'
    }

    // Action & Assert
    await expect(tokenManager.createAccessToken(abstractPayload)).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    await expect(tokenManager.createRefreshToken(abstractPayload)).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    await expect(tokenManager.verifyRefreshToken('jwttoken')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
    await expect(tokenManager.decodePayload('jwttoken')).rejects.toThrowError('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED')
  })
})
