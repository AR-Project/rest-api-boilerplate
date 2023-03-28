import { mock } from 'jest-mock-extended'

import RegisterUser from '../../../../Domains/users/entities/RegisterUser.js'
import RegisteredUser from '../../../../Domains/users/entities/RegisteredUser.js'
import IUserRepository from '../../../../Domains/users/UserRepository.js'
import IPasswordHash from '../../../security/PasswordHash.js'
import IRoleCheck from '../../../security/RoleCheck.js'
import AddUserUseCase, { type IAddUserPayload } from '../AddUserUseCase.js'

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload: IAddUserPayload = {
      username: 'dicoding',
      password: 'secretPassword',
      fullname: 'Dicoding Indonesia',
      key: 'superSecretKeyToBeAdmin'
    }
    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
      role: 'admin'
    })

    /** creating dependency of use case */
    const mockUserRepository = mock<IUserRepository>()
    const mockPasswordHash = mock<IPasswordHash>()
    const mockRoleCheck = mock<IRoleCheck>()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername.mockReturnValue(Promise.resolve())
    mockUserRepository.addUser.mockReturnValue(Promise.resolve(expectedRegisteredUser))
    mockPasswordHash.hash.mockReturnValue(Promise.resolve('encrypted_password'))
    mockRoleCheck.verifyKey.mockReturnValue('admin')

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase(
      mockUserRepository,
      mockPasswordHash,
      mockRoleCheck
    )

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser)
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockRoleCheck.verifyKey).toBeCalledWith(useCasePayload.key)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
      role: 'admin'
    }))
  })

  it('should orchestrating the add user action correctly without key', async () => {
    // Arrange
    const useCasePayload: IAddUserPayload = {
      username: 'dicoding',
      password: 'secretPassword',
      fullname: 'Dicoding Indonesia'
    }
    const expectedRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: useCasePayload.username,
      fullname: useCasePayload.fullname,
      role: 'base'
    })

    /** creating dependency of use case */
    const mockUserRepository = mock<IUserRepository>()
    const mockPasswordHash = mock<IPasswordHash>()
    const mockRoleCheck = mock<IRoleCheck>()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername.mockReturnValue(Promise.resolve())
    mockUserRepository.addUser.mockReturnValue(Promise.resolve(expectedRegisteredUser))

    mockPasswordHash.hash.mockReturnValue(Promise.resolve('encrypted_password'))
    mockRoleCheck.verifyKey.mockReturnValue('base')

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase(
      mockUserRepository,
      mockPasswordHash,
      mockRoleCheck
    )

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload)

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser)
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(useCasePayload.username)
    expect(mockPasswordHash.hash).toBeCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toBeCalledWith(new RegisterUser({
      username: useCasePayload.username,
      password: 'encrypted_password',
      fullname: useCasePayload.fullname,
      role: 'base'
    }))
  })
})
