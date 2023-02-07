import ClientError from './ClientError.js'

export default class NotFoundError extends ClientError {
  constructor (message: string) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}
