import pool from '../../database/postgres/pool.js'
import UserRepositoryPostgres from '../UserRepositoryPostgres.js'

import UsersTableTestHelper from '../../../_testsTableHelper/UsersTableTestHelper.js'
import InvariantError from '../../../Commons/exceptions/InvariantError.js'

import RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js'
import RegisterUser, { type IRegisterUser } from '../../../Domains/users/entities/RegisterUser.js'
import UserCoreInfo, { type IUserCoreInfo } from '../../../Domains/users/entities/UserCoreInfo.js'

describe('UserRepositoryPostgres', () => {
  const fakeIdGenerator = {
    generate: (): string => '123'
  } // stub!

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' }) // memasukan user baru dengan username dicoding

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError)
    })

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError)
    })
  })

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      // Arrange
      const registerUser: IRegisterUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
        role: 'base'
      })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await userRepositoryPostgres.addUser(registerUser)

      // Assert
      const users = await UsersTableTestHelper.findUsersById('user-123')
      expect(users).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'dicoding',
        password: 'secret_password',
        fullname: 'Dicoding Indonesia',
        role: 'base'
      })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'dicoding',
        fullname: 'Dicoding Indonesia',
        role: 'base'
      }))
    })
  })

  describe('getPasswordByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action & Assert
      await expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return username password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
        password: 'secret_password'
      })

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByUsername('dicoding')
      expect(password).toBe('secret_password')
    })
  })

  describe('getCoreInfoByUsername', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action & Assert
      await expect(userRepositoryPostgres.getCoreInfoByUsername('invalidUsername'))
        .rejects
        .toThrowError(InvariantError)
    })

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding', role: 'base' })

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const userId = await userRepositoryPostgres.getCoreInfoByUsername('dicoding')

      // Assert
      expect(userId).toStrictEqual(new UserCoreInfo({
        id: 'user-321',
        role: 'base'
      }))
    })
  })

  describe('changePassword function', () => {
    it('should update and persist new password', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding', password: 'old-password' })
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // action
      const prevInfo = await UsersTableTestHelper.findUsersById('user-321')
      await userRepositoryPostgres.changePassword('user-321', 'new-password')
      const updatedInfo = await UsersTableTestHelper.findUsersById('user-321')

      // Assert
      expect(prevInfo[0].password).toEqual('old-password')
      expect(updatedInfo[0].password).toEqual('new-password')
    })
  })
})
