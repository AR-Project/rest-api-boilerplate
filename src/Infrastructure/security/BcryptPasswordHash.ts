
import EncryptionHelper from '../../Applications/security/PasswordHash.js'
import AuthenticationError from '../../Commons/exceptions/AuthenticationError.js'
import bcrypt from 'bcrypt'

export default class BcryptPasswordHash extends EncryptionHelper {
  override async hash (password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  override async comparePassword (password: string, hashedPassword: string): Promise<void> {
    const result = await bcrypt.compare(password, hashedPassword)
    if (!result) {
      throw new AuthenticationError('kredensial yang Anda masukkan salah') as Error
    }
  }
}
