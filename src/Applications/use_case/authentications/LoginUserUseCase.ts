import UserLogin, { type IUserlogin } from '../../../Domains/users/entities/UserLogin.js'
import NewAuthentication from '../../../Domains/authentications/entities/NewAuth.js'

import NewAuth from '../../../Domains/authentications/entities/NewAuth.js'

import IUserRepository from '../../../Domains/users/UserRepository.js'
import type AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import type AuthenticationTokenManager from '../../security/AuthenticationTokenManager.js'
import type PasswordHash from '../../security/PasswordHash.js';

interface ILoginUserUseCase {
  userRepository: IUserRepository
  authenticationRepository: AuthenticationRepository
  authenticationTokenManager: AuthenticationTokenManager
  passwordHash: PasswordHash
}

export default class LoginUserUseCase {
  _userRepository: IUserRepository
  _authenticationRepository: AuthenticationRepository
  _authenticationTokenManager: AuthenticationTokenManager
  _passwordHash: PasswordHash

  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }: ILoginUserUseCase) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload: IUserlogin): Promise<NewAuth> {
    const { username, password } = new UserLogin(useCasePayload);

    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(password, encryptedPassword);

    const { id, role } = await this._userRepository.getCoreInfoByUsername(username);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ username, id, role });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ username, id, role });

    const newAuthentication = new NewAuthentication({
      accessToken,
      refreshToken,
    });

    // TODO MAKE token Table
    await this._authenticationRepository.addToken(newAuthentication.refreshToken);

    return newAuthentication;
  }
}

