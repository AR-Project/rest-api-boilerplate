/* eslint-disable no-unused-vars */
export default interface IAuthenticationRepository {
  addToken(token: string): Promise<void>
  checkAvailabilityToken(token: string): Promise<void>
  deleteToken(token: string): Promise<void>
}
