import request from 'supertest'
import server from '../createServer.js'

describe('GET /protected/nonsecure ', () => {
  it('should success and return 200 when accessed whithout token', async () => {
    const response = await request(server)
      .get('/protected/nonsecure')

      expect(response.statusCode).toBe(200)
      expect(response.body.status).toBeDefined()
      expect(response.body.message).toBeDefined()
      expect(response.body.status).toBe('success')
      expect(response.body.message).toBe('unprotected route')
    }) 
})