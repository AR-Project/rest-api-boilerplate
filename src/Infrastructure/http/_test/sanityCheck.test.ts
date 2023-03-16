import request from 'supertest'
import server from '../createServer.js'

describe('GET / endpoint', () => {
  it('should return 200 and message ', async () => {
    const response = await request(server)
      .get('/')

    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBeDefined()
    expect(response.body.message).toBe('hello world, from boilerplate REST API')
  })
})