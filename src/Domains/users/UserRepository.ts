import { IRegisterUser } from './entities/RegisterUser.js'
import { IRegisteredUser } from './entities/RegisteredUser.js'
import { IUserCoreInfo } from './entities/UserCoreInfo.js'

export default interface IUserRepository {
  verifyAvailableUsername: (username: string) => Promise<void>
  addUser: (registerUser: IRegisterUser) => Promise<IRegisteredUser>
  getPasswordByUsername: (username: string) => Promise<string>
  getCoreInfoByUsername: (username: string) => Promise<IUserCoreInfo>
  changePassword: (id: string, newPassword: string) => Promise<void>
}
