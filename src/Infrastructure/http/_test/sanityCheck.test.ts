import request from 'supertest'
import server from '../createServer.js'
import container from '../../container.js'

describe('GET / endpoint', () => {
  it('should return 200 and message ', async () => {
    const response = await request(server(container))
      .get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toBe('hello world, from boilerplate REST API')
  })
})
