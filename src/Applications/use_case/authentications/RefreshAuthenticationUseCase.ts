import { injectable, inject } from 'tsyringe'
import type IAuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'
import type IAuthenticationTokenManager from '../../security/AuthenticationTokenManager.js'

export interface IRefreshTokenUseCasePayload {
  refreshToken: string
}

@injectable()
export default class RefreshAuthenticationUseCase {
  _authenticationRepository: IAuthenticationRepository
  _authenticationTokenManager: IAuthenticationTokenManager
  constructor(
    @inject('IAuthenticationRepository')
    authenticationRepository: IAuthenticationRepository,
    @inject('IAuthenticationTokenManager')
    authenticationTokenManager: IAuthenticationTokenManager,
  ) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload: IRefreshTokenUseCasePayload): Promise<string> {
    this._verifyPayload(useCasePayload);
    const { refreshToken } = useCasePayload;

    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);

    const { username, id, role } = await this._authenticationTokenManager.decodePayload(refreshToken);

    return this._authenticationTokenManager.createAccessToken({ username, id, role });
  }

  _verifyPayload(payload: IRefreshTokenUseCasePayload): void {
    const { refreshToken } = payload;

    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
