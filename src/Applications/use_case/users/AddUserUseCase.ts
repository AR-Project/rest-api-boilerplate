import { injectable, inject } from 'tsyringe'
import RegisterUser from '../../../Domains/users/entities/RegisterUser.js'
import RegisteredUser, { type IRegisteredUser } from '../../../Domains/users/entities/RegisteredUser.js'
import type IUserRepository from '../../../Domains/users/UserRepository.js'
import type IPasswordHash from '../../security/PasswordHash.js'
import type IRoleCheck from '../../security/RoleCheck.js'

export interface IAddUserPayload {
  username: string
  password: string
  fullname: string
  key?: string
}

@injectable()
export default class AddUserUseCase {
  _userRepository: IUserRepository
  _passwordHash: IPasswordHash
  _roleCheck: IRoleCheck

  constructor(
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IPasswordHash') passwordHash: IPasswordHash,
    @inject('IRoleCheck') roleCheck: IRoleCheck
  ) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
    this._roleCheck = roleCheck
  }

  async execute(useCasePayload: IAddUserPayload): Promise<IRegisteredUser> {
    const { username, password, fullname, key } = useCasePayload
    let role: string = this._roleCheck.verifyKey(key)
    const registerUser: RegisterUser = new RegisterUser({
      username, password, fullname, role
    })

    await this._userRepository.verifyAvailableUsername(registerUser.username)
    registerUser.password = await this._passwordHash.hash(registerUser.password)

    return this._userRepository.addUser(registerUser)
  }
}
