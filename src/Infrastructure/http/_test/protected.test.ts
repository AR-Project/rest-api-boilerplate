import request from 'supertest'
import server from '../createServer.js'
import container from '../../container.js'
import pool from '../../database/postgres/pool.js'

import UserTableTestHelper from '../../../_testsTableHelper/UsersTableTestHelper.js'
import AuthenticationsTableTestHelper from '../../../_testsTableHelper/AuthenticationsTableTestHelper.js'

// Types
import { type IAddUserPayload } from '../../../Applications/use_case/users/AddUserUseCase.js'

describe('GET /protected/nonsecure ', () => {
  it('should success and return 200 when accessed whithout token', async () => {
    const response = await request(server(container))
      .get('/protected/nonsecure')

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBeDefined()
    expect(response.body.message).toBeDefined()
    expect(response.body.status).toBe('success')
    expect(response.body.message).toBe('unprotected route')
  })
})

describe('GET /protected/secure endpoint', () => {
  let accessToken: string
  let refreshToken: string

  beforeAll(async () => {
    // Arrange 
    const addUserPayload: IAddUserPayload = {
      username: 'arproject',
      password: 'secret',
      fullname: 'AR Project'
    }
    const loginPayload = {
      username: 'arproject',
      password: 'secret'
    }

    // register user
    await request(server(container))
      .post('/users')
      .send(addUserPayload)
      .set('Accept', 'application/json')

    const loginResponse = await request(server(container))
      .post('/authentications')
      .send(loginPayload)
      .set('Accept', 'application/json')

    accessToken = loginResponse.body.data.accessToken
    refreshToken = loginResponse.body.data.refreshToken
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  it('should fail when accessed without token', async () => {
    const response = await request(server(container))
      .get('/protected/secure')

    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBeDefined()
    expect(response.body.message).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBe('unauthorized')
  })
  it('should return 200 when being accessed with a valid token', async () => {
    const response = await request(server(container))
      .get('/protected/secure')
      .set('Authorization', `bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBeDefined()
    expect(response.body.message).toBeDefined()
    expect(response.body.status).toBe('success')
    expect(response.body.message).toBe('protected route')
  })
  it('should return 401 when being accessed with a invalid token', async () => {
    const response = await request(server(container))
      .get('/protected/secure')
      .set('Authorization', `bearer ${refreshToken}`)

    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBeDefined()
    expect(response.body.message).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBe('unauthorized')
  })
})
