// istanbul ignore file
import pkg from 'pg'

const { Pool } = pkg

const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST
}

// @ts-expect-error mainly in port data type
const pool = process.env.NODE_ENV === 'test' ? new Pool(testConfig) : new Pool()

export default pool
