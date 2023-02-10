/* istanbul ignore file */
import pool from '../Infrastructure/database/postgres/pool.js'

interface IFindToken {
    token: string
}

const AuthenticationsTableTestHelper = {
  async addToken(token: string): Promise<void> {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

 

  async findToken(token: string): Promise<IFindToken[]> {

    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows as Array<IFindToken>;
  },

  async countTotalRows(): Promise<number> {
    const result = await pool.query('SELECT COUNT(*) FROM authentications')
    
    return parseInt(result.rows[0].count, 10)
  },

  async cleanTable(): Promise<void> {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

export default AuthenticationsTableTestHelper;
