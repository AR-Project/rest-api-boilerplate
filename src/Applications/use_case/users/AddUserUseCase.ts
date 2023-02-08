import RegisterUser from '../../../Domains/users/entities/RegisterUser.js'
import type RegisteredUser from '../../../Domains/users/entities/RegisteredUser.js'
import type UserRepository from '../../../Domains/users/UserRepository.js'
import type PasswordHash from '../../security/PasswordHash.js'
import type RoleCheck from '../../security/RoleCheck.js'

interface IAddUserUseCase {
  userRepository: UserRepository
  passwordHash: PasswordHash
  roleCheck: RoleCheck
}

export interface IAddUserPayload {
  username: string
  password: string
  fullname: string
  key?: string
}

export default class AddUserUseCase {
  _userRepository: UserRepository
  _passwordHash: PasswordHash
  _roleCheck: RoleCheck

  constructor ({ userRepository, passwordHash, roleCheck }: IAddUserUseCase) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
    this._roleCheck = roleCheck
  }

  async execute (useCasePayload: IAddUserPayload): Promise<RegisteredUser> {
    const { username, password, fullname, key } = useCasePayload
    let role: string = this._roleCheck.verifyKey(key) ? 'admin' : 'base'
    const registerUser: RegisterUser = new RegisterUser({
      username, password, fullname, role
    })

    await this._userRepository.verifyAvailableUsername(registerUser.username)
    registerUser.password = await this._passwordHash.hash(registerUser.password)

    return this._userRepository.addUser(registerUser)
  }
}
