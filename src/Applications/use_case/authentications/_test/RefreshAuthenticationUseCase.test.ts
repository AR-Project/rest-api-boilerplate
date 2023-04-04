import { mock } from 'jest-mock-extended'

import AuthenticationRepository from '../../../../Domains/authentications/AuthenticationRepository.js'
import IAuthenticationTokenManager from '../../../security/AuthenticationTokenManager.js'

import RefreshAuthenticationUseCase from '../RefreshAuthenticationUseCase'

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    // @ts-expect-error expect error wrong payload
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert
    // @ts-expect-error testing wrong type payload
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 1,
    };
    // @ts-expect-error expect error wrong payload
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert
    // @ts-expect-error testing wrong type payload
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token',
    };
    const mockAuthenticationRepository = mock<AuthenticationRepository>();
    const mockAuthenticationTokenManager = mock<IAuthenticationTokenManager>();

    // Mocking
    mockAuthenticationRepository.checkAvailabilityToken
      .mockReturnValue(Promise.resolve())
    mockAuthenticationTokenManager.verifyRefreshToken
      .mockReturnValue(Promise.resolve(
        { username: 'dicoding', id: 'user-123', role: 'base' }
      ))
    mockAuthenticationTokenManager.decodePayload
      .mockReturnValue(Promise.resolve(
        { username: 'dicoding', id: 'user-123', role: 'base' }
      ))
    mockAuthenticationTokenManager.createAccessToken
      .mockReturnValue(Promise.resolve('some_new_access_token'));

    // Create the use case instace
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase(
      mockAuthenticationRepository,
      mockAuthenticationTokenManager,
    );

    // Action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken)
      .toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload)
      .toBeCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123', role: 'base' });
    expect(accessToken).toEqual('some_new_access_token');
  });
});
