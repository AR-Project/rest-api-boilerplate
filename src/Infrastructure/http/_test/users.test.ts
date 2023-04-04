import request from 'supertest'
import server from '../createServer.js'
import container from '../../container.js'
import pool from '../../database/postgres/pool.js'

import UserTableTestHelper from '../../../_testsTableHelper/UsersTableTestHelper.js'

describe('POST /users routes', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...env }
  })

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    process.env = env
    await UserTableTestHelper.cleanTable();
  });

  /**
   * To be FAILED
   */
  it('should fail and return 400 when no payload', async () => {
    const response = await request(server(container))
      .post('/users')

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBeDefined()
  })

  it('should fail and return 400 when missing needed property', async () => {
    const requestPayload = {
      username: 'warungpos',
      password: 'secret',
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
  })

  it('should response 400 when request payload not meet data type specification', async () => {
    const requestPayload = {
      username: 'warungpos',
      password: 'secret',
      fullname: ['fullname in array']
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('tidak dapat membuat user baru karena tipe data tidak sesuai');
  })

  it('should response 400 when username more than 50 character', async () => {
    const requestPayload = {
      username: 'warungposwarungposwarungposwarungposwarungposwarungpos',
      password: 'secret',
      fullname: 'Warung Pos Backend'
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('tidak dapat membuat user baru karena karakter username melebihi batas limit');
  })

  it('should response 400 when username contain restricted character', async () => {
    const requestPayload = {
      username: 'warung spasi pos',
      password: 'secret',
      fullname: 'Warung Pos Backend'
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('tidak dapat membuat user baru karena username mengandung karakter terlarang');
  })

  it('should response 400 when username unavailable', async () => {
    await UserTableTestHelper.addUser({ username: 'warungpos' });
    const requestPayload = {
      username: 'warungpos',
      password: 'secret',
      fullname: 'Warung Pos Backend'
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('fail')
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toEqual('username tidak tersedia');
  })

  /**
   * To be SUCCESS
   */
  it('should persist data and return 201 when creating normal user', async () => {
    const requestPayload = {
      username: 'warungpos',
      password: 'secret',
      fullname: 'Warung Pos Base'
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')


    // Assert
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('succes')
    expect(response.body.data.addedUser).toBeDefined()
    expect(response.body.data.addedUser.role).toBe('base')
    expect(response.body.data.addedUser.username).toBe(requestPayload.username)
    expect(response.body.data.addedUser.fullname).toBe(requestPayload.fullname)

  })
  it('should persist data and return 201 when creating admin user when admin register is true', async () => {
    process.env.ADMIN_TOKEN = 'key'
    process.env.ADMIN_REGISTER = 'true'

    const requestPayload = {
      username: 'warungpos',
      password: 'secret',
      fullname: 'Warung Pos Admin',
      key: 'key'
    }

    // Action
    const response = await request(server(container))
      .post('/users')
      .send(requestPayload)
      .set('Accept', 'application/json')


    // Assert
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('succes')
    expect(response.body.data.addedUser).toBeDefined()
    expect(response.body.data.addedUser.role).toBe('admin')
    expect(response.body.data.addedUser.username).toBe(requestPayload.username)
    expect(response.body.data.addedUser.fullname).toBe(requestPayload.fullname)

  })
})
