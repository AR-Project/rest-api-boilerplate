import RegisterUser from '../../../../Domains/users/entities/RegisterUser.js'
import RegisteredUser from '../../../../Domains/users/entities/RegisteredUser.js'
import UserRepository from '../../../../Domains/users/UserRepository.js'
import PasswordHash from '../../../security/PasswordHash.js'
import RoleCheck from '../../../security/RoleCheck.js'
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
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()
    const mockRoleCheck = new RoleCheck()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(async () => await Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(async () => await Promise.resolve(expectedRegisteredUser))
    mockRoleCheck.verifyKey = jest.fn(()=> 'admin')

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      roleCheck: mockRoleCheck
    })

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
    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()
    const mockRoleCheck = new RoleCheck()

    /** mocking needed function */
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(async () => { await Promise.resolve() })
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(async () => await Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(async () => await Promise.resolve(expectedRegisteredUser))
    mockRoleCheck.verifyKey = jest.fn(() => 'base')
      // .mockImplementation(async () => await Promise.resolve('base'))

    /** creating use case instance */
    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      roleCheck: mockRoleCheck
    })

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
