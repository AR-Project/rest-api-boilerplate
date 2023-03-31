import server from '../createServer'
import request from 'supertest'
import container from '../../container.js'
import pool from '../../database/postgres/pool.js'

import UserTableTestHelper from '../../../_testsTableHelper/UsersTableTestHelper.js'
import AuthenticationsTableTestHelper from '../../../_testsTableHelper/AuthenticationsTableTestHelper.js'

// Types
import { type IAddUserPayload } from '../../../Applications/use_case/users/AddUserUseCase.js'

describe('authentication endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /authentications', () => {
    /**
     * FAIL TEST SECTION
     */
    it('should fail and return 400 when no payload', async () => {
      const response = await request(server(container))
        .post('/authentications')

      expect(response.statusCode).toBe(400)
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toBe('harus mengirimkan username dan password')

    })

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
      };
      const response = await request(server(container))
        .post('/authentications')
        .send(requestPayload)
        .set('Accept', 'application/json')


      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toBe('harus mengirimkan username dan password')

      // expect(responseJson.message).toEqual('harus mengirimkan username dan password');
    })

    it('should response 400 if login payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        username: 123,
        password: 'secret',
      };
      // Action
      const response = await request(server(container))
        .post('/authentications')
        .send(requestPayload)
        .set('Accept', 'application/json')

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toEqual('username dan password harus string');
    });

    /**
    * SUCCESS TEST SECTION
    */
    it('should response 201 and return both accessToken and refreshToken ', async () => {
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

      const registerResponse = await request(server(container))
        .post('/users')
        .send(addUserPayload)
        .set('Accept', 'application/json')

      const loginResponse = await request(server(container))
        .post('/authentications')
        .send(loginPayload)
        .set('Accept', 'application/json')

      const totalRow = await AuthenticationsTableTestHelper.countTotalRows()

      expect(registerResponse.statusCode).toEqual(201)
      expect(loginResponse.statusCode).toBe(201)
      expect(loginResponse.body.status).toBe('success')
      expect(loginResponse.body.data.accessToken).toBeDefined()
      expect(loginResponse.body.data.refreshToken).toBeDefined()
      expect(totalRow).toBe(1)
    })
  })

  describe('PUT /authentications', () => {
    /**
    * FAIL TEST SECTION
    */
    it('should return fail, 400 when contain no payload', async () => {
      const response = await request(server(container))
        .put('/authentications')

      expect(response.statusCode).toBe(400)
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toBe('harus mengirimkan token refresh')
    })

    it('should response 400 if login payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        wrongProperty: 'wrong_data',
      };
      const response = await request(server(container))
        .put('/authentications')
        .send(requestPayload)
        .set('Accept', 'application/json')


      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toBe('harus mengirimkan token refresh')
    })

    it('should response 400 if payload have wrong data type', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: ['wrong data type'],
      };
      const response = await request(server(container))
        .put('/authentications')
        .send(requestPayload)
        .set('Accept', 'application/json')


      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toBe('refresh token harus string')
    })

    it('should response 400 and when token is invalid', async () => {
      const addUserPayload: IAddUserPayload = {
        username: 'arproject',
        password: 'secret',
        fullname: 'AR Project'
      }
      const loginPayload = {
        username: 'arproject',
        password: 'secret'
      }

      const registerResponse = await request(server(container))
        .post('/users')
        .send(addUserPayload)
        .set('Accept', 'application/json')

      const loginResponse = await request(server(container))
        .post('/authentications')
        .send(loginPayload)
        .set('Accept', 'application/json')

      const { accessToken } = loginResponse.body.data

      const refreshTokenResponse = await request(server(container))
        .put('/authentications')
        .send({ refreshToken: accessToken })
        .set('Accept', 'application/json')

      expect(registerResponse.statusCode).toEqual(201)
      expect(loginResponse.statusCode).toBe(201)
      expect(refreshTokenResponse.statusCode).toEqual(400)
      expect(refreshTokenResponse.body.status).toBe('fail')
      expect(refreshTokenResponse.body.message).toBe('refresh token tidak valid')
    })

    /**
    * SUCCESS TEST SECTION
    */
    it('should response 200 and return newAccessTokens', async () => {
      const addUserPayload: IAddUserPayload = {
        username: 'arproject',
        password: 'secret',
        fullname: 'AR Project'
      }
      const loginPayload = {
        username: 'arproject',
        password: 'secret'
      }

      const registerResponse = await request(server(container))
        .post('/users')
        .send(addUserPayload)
        .set('Accept', 'application/json')

      const loginResponse = await request(server(container))
        .post('/authentications')
        .send(loginPayload)
        .set('Accept', 'application/json')

      const { refreshToken } = loginResponse.body.data

      const refreshTokenResponse = await request(server(container))
        .put('/authentications')
        .send({ refreshToken })
        .set('Accept', 'application/json')

      expect(registerResponse.statusCode).toEqual(201)
      expect(loginResponse.statusCode).toBe(201)
      expect(refreshTokenResponse.statusCode).toEqual(200)
      expect(refreshTokenResponse.body.status).toBe('success')
      expect(refreshTokenResponse.body.data.accessToken).toBeDefined()
    })

  })

  describe('when DELETE /authentications', () => {
    /**
    * FAIL TEST SECTION
    */

    it('should return fail, 400 when contain no payload', async () => {
      const response = await request(server(container))
        .delete('/authentications')

      expect(response.statusCode).toBe(400)
      expect(response.body.status).toBeDefined()
      expect(response.body.status).toBe('fail')
      expect(response.body.message).toBeDefined()
      expect(response.body.message).toBe('harus mengirimkan token refresh')
    })

    it('should response 400 if refresh token not registered in database', async () => {
      // Arrange
      // Action
      const response = await request(server(container))
        .delete('/authentications')
        .send({ refreshToken: 'invalid-token' })
        .set('Accept', 'application/json')

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token tidak ditemukan di database');
    });


    it('should response 400 if payload not contain refresh token', async () => {
      // Arrange
      // Action
      const response = await request(server(container))
        .delete('/authentications')
        .send({})
        .set('Accept', 'application/json')

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('harus mengirimkan token refresh');
    });

    it('should response 400 if refresh token not string', async () => {
      // Arrange
      // Action
      const response = await request(server(container))
        .delete('/authentications')
        .send({ refreshToken: 123 })
        .set('Accept', 'application/json')

      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual('fail');
      expect(response.body.message).toEqual('refresh token harus string');
    });


    it('should response 200 if refresh token valid', async () => {
      // Arrange
      const refreshToken = 'refresh_token';
      await AuthenticationsTableTestHelper.addToken(refreshToken);

      // Action
      const response = await request(server(container))
        .delete('/authentications')
        .send({ refreshToken })
        .set('Accept', 'application/json')

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual('success');
    });
  })
})
