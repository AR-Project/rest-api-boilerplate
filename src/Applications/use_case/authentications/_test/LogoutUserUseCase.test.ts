import { mock } from 'jest-mock-extended'

import AuthenticationRepository from '../../../../Domains/authentications/AuthenticationRepository.js'

import LogoutUserUseCase from '../LogoutUserUseCase.js'

describe('LogoutUserUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};
    // @ts-expect-error no constructor needed
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    // @ts-expect-error test for wrong payload
    await expect(logoutUserUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 123,
    };
    // @ts-expect-error no constructor needed
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert    
    // @ts-expect-error test for wrong payload
    await expect(logoutUserUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refreshToken',
    };
    const mockAuthenticationRepository = mock<AuthenticationRepository>();
    mockAuthenticationRepository.checkAvailabilityToken
      .mockReturnValue(Promise.resolve());
    mockAuthenticationRepository.deleteToken
      .mockReturnValue(Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase(
      mockAuthenticationRepository,
    );

    // Act
    await logoutUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
