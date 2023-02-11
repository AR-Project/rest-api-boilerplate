import type AuthenticationRepository from '../../../Domains/authentications/AuthenticationRepository.js'

export interface IDeleteTokenUseCasePayload {
  refreshToken: string
}

interface IDeleteTokenUseCase {
  authenticationRepository: AuthenticationRepository
}

export default class LogoutUserUseCase {
  _authenticationRepository: AuthenticationRepository
  constructor({
    authenticationRepository,
  }: IDeleteTokenUseCase) {
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload:IDeleteTokenUseCasePayload):Promise<void> {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._authenticationRepository.checkAvailabilityToken(refreshToken);
    await this._authenticationRepository.deleteToken(refreshToken);
  }

  _validatePayload(payload: IDeleteTokenUseCasePayload): void {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutUserUseCase;
