import ClientError from './ClientError.js'

export default class AuthenticationError extends ClientError {
  constructor (message: string) {
    super(message, 401)
    this.name = 'AuthenticationError'
  }
}
