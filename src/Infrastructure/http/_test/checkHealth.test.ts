import request from 'supertest'
import server from '../createServer.js'

describe('/health Route', () => {
  it('should return success message', async () => {
    // Arrange & Action
    const response = await request(server)
    .get('/health')
    
    // Assert
    expect(response.body.message).toBeDefined()
    expect(response.body.status).toBeDefined()
    expect(response.body.status).toBe('success')
    expect(response.statusCode).toBe(200)
  })
})

describe('/ route', () => {
  it('should return success message', async () => {
    // Arrange & Action
    const response = await request(server)
    .get('/')
    
    // Assert
    expect(response.body.message).toBeDefined()
    expect(response.statusCode).toBe(200)
  })
})

describe('/generate route', () => {
  it('should return success message', async () => {
    // Arrange & Action
    const response = await request(server)
    .get('/generate')

    // Assert
    expect(response.body.message).toBeDefined()
    expect(response.body.id).toBeDefined()
    expect(response.statusCode).toBe(201)
  })
})