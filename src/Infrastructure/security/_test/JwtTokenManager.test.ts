import Jwt from 'jsonwebtoken'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'
import JwtTokenManager from '../JwtTokenManager.js'

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'warungposadmin',
        id: 'user-123',
        level: 'base'
      }
      const jwtTokenManager = new JwtTokenManager()
      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Assert     
      expect(typeof accessToken).toEqual('string')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'warungposadmin',
        id: 'user-123',
        level: 'base'
      }
      const jwtTokenManager = new JwtTokenManager()

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      // Assert
      expect(typeof refreshToken).toEqual('string')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const payload = {
        username: 'warungposadmin',
        id: 'user-123',
        level: 'base'
      }

      const jwtTokenManager = new JwtTokenManager()
      const accessToken = await jwtTokenManager.createAccessToken(payload)
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
      .rejects
      .toThrow(InvariantError);
    })

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const payload = {
        username: 'warungposadmin',
        id: 'user-123',
        level: 'base'
      }
      const jwtTokenManager = new JwtTokenManager()
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)
      const returnedPayload = await jwtTokenManager.verifyRefreshToken(refreshToken)

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError)

      expect(returnedPayload).toStrictEqual(payload);
    }) 
  })
  

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const payload = {
        username: 'warungposadmin',
        id: 'user-123',
        level: 'base'
      }

      const jwtTokenManager = new JwtTokenManager()
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Action
      const expectedPayload = await jwtTokenManager.decodePayload(accessToken)

      // Action & Assert
      expect(expectedPayload).toStrictEqual(payload)
    })
  })
})
