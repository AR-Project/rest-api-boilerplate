import InvariantError from './InvariantError.js'
import AuthenticationError from './AuthenticationError.js'
import type ClientError from './ClientError.js'

export type ITranslatedError = undefined | Error | InvariantError | AuthenticationError | ClientError

interface IDomainErrorTranslator {
  _directories: Record<string, ClientError>
  translate: (error: Error) => ITranslatedError

}

const DomainErrorTranslator: IDomainErrorTranslator = {
  _directories: {},
  translate (error: Error): ITranslatedError {
    if (DomainErrorTranslator._directories[error.message] != null) {
      return DomainErrorTranslator._directories[error.message]
    } else {
      return error
    }
  }
}

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'CREDENTIALS.NOT_CONTAIN_NEEDED_PROPERTY': new AuthenticationError('Missing authentication'),
  'CREDENTIALS.NOT_MEET_DATA_TYPE_SPECIFICATION': new AuthenticationError('Missing authentication'),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak bisa membuat thread baru, data tidak sesuai'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak bisa membuat thread baru, data tidak lengkap'),
  'COMMENT.MISSING_CONTENT': new InvariantError('tidak bisa membuat komentar baru, data tidak lengkap'),
  'COMMENT.MISSING_OWNER': new InvariantError('tidak bisa membuat komentar baru, data tidak lengkap'),
  'COMMENT.MISSING_THREAD_ID': new InvariantError('tidak bisa membuat komentar baru, data tidak lengkap'),
  'COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak bisa membuat komentar baru, data tidak sesuai'),
  'REPLY.MISSING_CONTENT': new InvariantError('tidak bisa membuat balasan komentar baru, data tidak lengkap'),
  'REPLY.MISSING_OWNER': new InvariantError('tidak bisa membuat balasan komentar baru, data tidak lengkap'),
  'REPLY.MISSING_COMMENT_ID': new InvariantError('tidak bisa membuat balasan komentar baru, data tidak lengkap'),
  'REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak bisa membuat balasan komentar baru, data tidak sesuai'),
  'TESTING.CUSTOM_ERROR': new InvariantError('error for testing purpose')
}

export default DomainErrorTranslator
