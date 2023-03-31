import { injectable, inject } from 'tsyringe'
import InvariantError from '../../Commons/exceptions/InvariantError.js'

import { type Pool } from 'pg';
import type IIdGenerator from '../../Applications/tools/IdGenerator.js'

import type IUserRepository from '../../Domains/users/UserRepository.js'
import RegisteredUser, { type IRegisteredUser } from '../../Domains/users/entities/RegisteredUser.js'
import UserCoreInfo, { type IUserCoreInfo } from '../../Domains/users/entities/UserCoreInfo.js'
import { type IRegisterUser } from '../../Domains/users/entities/RegisterUser.js'

@injectable()
export default class UserRepositoryPostgres implements IUserRepository {
  _pool: Pool
  _idGenerator: IIdGenerator

  constructor(
    @inject("Pool") pool: Pool,
    @inject("IIdGenerator") idGenerator: IIdGenerator
  ) {
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async verifyAvailableUsername(username: string): Promise<void> {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount !== 0) {
      throw new InvariantError('username tidak tersedia')
    }
  }

  async addUser(registerUser: IRegisterUser): Promise<IRegisteredUser> {
    const { username, password, fullname, role }: IRegisterUser = registerUser

    const id = `user-${this._idGenerator.generate()}`

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id, username, fullname, role',
      values: [id, username, password, fullname, role]
    }

    const result = await this._pool.query(query)

    return new RegisteredUser(result.rows[0])
  }

  async getPasswordByUsername(username: string): Promise<string> {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new InvariantError('username tidak ditemukan')
    }

    return result.rows[0].password
  }

  async getCoreInfoByUsername(username: string): Promise<IUserCoreInfo> {
    const query = {
      text: 'SELECT id, role FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rowCount === 0) {
      throw new InvariantError('user info tidak ditemukan')
    }

    const { id, role } = result.rows[0]

    return new UserCoreInfo({ id, role })
  }

  async changePassword(id: any, newPassword: any): Promise<void> {
    const query = {
      text: 'UPDATE users SET password = $1 WHERE id = $2',
      values: [newPassword, id]
    }

    await this._pool.query(query)
  }
}
