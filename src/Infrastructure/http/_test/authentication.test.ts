import server from '../createServer'
import request from 'supertest'

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
    it('should fail and return 400 when no payload', async () => {
      const response = await request(server)
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
      const response = await request(server)
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
      const response = await request(server)
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

      const registerResponse = await request(server)
        .post('/users')
        .send(addUserPayload)
        .set('Accept', 'application/json')

      const loginResponse = await request(server)
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
})