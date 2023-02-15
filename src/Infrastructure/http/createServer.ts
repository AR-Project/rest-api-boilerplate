import express, { type Request, type Response } from 'express'
import { expressjwt, Request as JWTRequest } from "express-jwt";

// Middleware
import errorHandlerMiddleware from '../../Interface/http/error/errorHandler.js'

// Router
import userRouter from '../../Interface/http/api/users.js'
import authenticationRouter from '../../Interface/http/api/authentications.js'
import protectedRouter from '../../Interface/http/api/protected.js'


const server = express()

// Middleware
server.use(express.json())
server.use(
  expressjwt({
    secret: process.env.ACCESS_TOKEN_KEY as string,
    algorithms: ["HS256"]
  }).unless({
    path: [
      { url: '/users', methods: ['POST'] },
      { url: '/authentications' },
      { url: '/protected/nonsecure' }
    ]
  })
)

// Sanity Check
server.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'hello world, from boilerplate REST API'
  })
})

// Register Route
server.use('/users', userRouter)
server.use('/authentications', authenticationRouter)
server.use('/protected', protectedRouter)

// Error Middleware
server.use(errorHandlerMiddleware)

export default server