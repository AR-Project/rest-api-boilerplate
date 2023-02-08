// istanbul ignore file
import pool from '../Infrastructure/database/postgres/pool.js'

export interface IUserTableRow {
  id?: string
  username?: string
  password?: string
  fullname?: string
  level?: string
}

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia', level = 'admin'
  }: IUserTableRow): Promise<void> {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5)',
      values: [id, username, password, fullname, level]
    }

    await pool.query(query)
  },

  async findUsersById (id: string): Promise<IUserTableRow[]> {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id]
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable () {
    await pool.query('DELETE FROM users WHERE 1=1')
  }
}

export default UsersTableTestHelper
