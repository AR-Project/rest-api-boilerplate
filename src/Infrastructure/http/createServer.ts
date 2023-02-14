import express, { type Request, type Response} from 'express'

import checkHealth from '../../Interface/http/api/checkHealth.js'
import errorHandlerMiddleware from '../../Interface/http/error/errorHandler.js'

import userRouter from '../../Interface/http/api/users.js'
import authenticationRouter from '../../Interface/http/api/authentications.js'


const server = express()

// Middleware
server.use(express.json())

// Sanity Check
server.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello world, from boilerplate REST API'
  })
})
server.get('/health', checkHealth)

// Register Route
server.use('/users', userRouter)
server.use('/authentications', authenticationRouter)

// Error Middleware
server.use(errorHandlerMiddleware)

export default server