import { mock } from 'jest-mock-extended'

import IUserRepository from '../../../../Domains/users/UserRepository.js'
import AuthenticationRepository from '../../../../Domains/authentications/AuthenticationRepository.js'
import NewAuth from '../../../../Domains/authentications/entities/NewAuth.js'

import IAuthenticationTokenManager from '../../../security/AuthenticationTokenManager.js'
import IPasswordHash from '../../../security/PasswordHash.js'

import LoginUserUseCase from '../LoginUserUseCase.js'

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
    const mockUserRepository = mock<IUserRepository>();
    const mockAuthenticationRepository = mock<AuthenticationRepository>();
    const mockAuthenticationTokenManager = mock<IAuthenticationTokenManager>();
    const mockPasswordHash = mock<IPasswordHash>()

    // Mocking
    mockUserRepository.getPasswordByUsername
      .mockReturnValue(Promise.resolve('encrypted_password'))
    mockUserRepository.getCoreInfoByUsername
      .mockReturnValue(Promise.resolve({ id: 'user-123', role: 'base' }))

    mockPasswordHash.comparePassword.mockReturnValue(Promise.resolve());
    mockAuthenticationTokenManager.createAccessToken
      .mockReturnValue(Promise.resolve('access_token'));
    mockAuthenticationTokenManager.createRefreshToken
      .mockReturnValue(Promise.resolve('refresh_token'));
    mockAuthenticationRepository.addToken
      .mockReturnValue(Promise.resolve());

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase(
      mockUserRepository,
      mockAuthenticationRepository,
      mockAuthenticationTokenManager,
      mockPasswordHash,
    );

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(actualAuthentication).toEqual(expectedAuthentication);
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding');
    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getCoreInfoByUsername)
      .toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123', role: 'base' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ username: 'dicoding', id: 'user-123', role: 'base' });
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(expectedAuthentication.refreshToken);
  });
});
