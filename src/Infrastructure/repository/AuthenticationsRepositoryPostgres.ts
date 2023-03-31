import { injectable, inject } from 'tsyringe'
import InvariantError from "../../Commons/exceptions/InvariantError.js"
import IAuthenticationRepository from "../../Domains/authentications/AuthenticationRepository.js"

import { type Pool } from 'pg';

@injectable()
export default class AuthenticationRepositoryPostgres implements IAuthenticationRepository {
  _pool: Pool

  constructor(@inject("Pool") pool: Pool) {
    this._pool = pool;
  }

  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async checkAvailabilityToken(token: string): Promise<void> {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token: string): Promise<void> {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}
